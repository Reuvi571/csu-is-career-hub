from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import JobPosting, CompanyReview, Company, Certification
from datetime import timedelta
from django.utils import timezone
from django.db.models import Q, Avg, Count


# DASHBOARD
def dashboard(request):
    cutoff = timezone.now().date() - timedelta(days=16)
    jobs = JobPosting.objects.filter(date_posted__gte=cutoff).order_by('-date_posted')
    return render(request, 'index.html', {'jobs': jobs})


# MDN POPUP
def mdn_popup(request, skill_name):
    definitions = {
        'JavaScript': 'A lightweight, interpreted, object-oriented language with first-class functions.',
        'Python': 'A high-level, general-purpose programming language known for readability.',
        'SQL': 'Standard language for storing, manipulating and retrieving data in databases.',
        'React': 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
        'HTML': 'The standard markup language for documents designed to be displayed in a web browser.'
    }

    desc = "Learn more about this technology on the official MDN Web Docs."
    for key, val in definitions.items():
        if key.lower() in skill_name.lower():
            desc = val
            skill_name = key
            break

    return HttpResponse(f"""
        <div class="p-3 mt-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm transition-all">
            <p class="font-bold text-blue-800">MDN Dictionary: {skill_name}</p>
            <p class="text-blue-700">{desc}</p>
        </div>
    """)


# JOBS API
def get_jobs(request):
    cutoff = timezone.now().date() - timedelta(days=16)
    jobs = JobPosting.objects.filter(date_posted__gte=cutoff).order_by('-date_posted')

    role = request.GET.get('role')
    cert = request.GET.get('certification')
    location = request.GET.get('location')
    search = request.GET.get('search')

    if role:
        jobs = jobs.filter(roles__name__icontains=role)

    if cert:
        jobs = jobs.filter(certifications__name__icontains=cert)

    if location:
        jobs = jobs.filter(location__icontains=location)

    if search:
        jobs = jobs.filter(
            Q(title__icontains=search) |
            Q(company__name__icontains=search)
        )

    jobs = jobs.distinct()

    data = []
    for job in jobs:
        data.append({
            "id": str(job.id),
            "title": job.title,
            "company": {
                "id": job.company.id,
                "name": job.company.name,
            },
            "location": job.location,
            "description": job.description or "",
            "experience_level": job.experience_level,
            "salary_range": job.salary_range or "",
            "certifications": [c.name for c in job.certifications.all()],
            "roles": [r.name for r in job.roles.all()],
            "date_posted": job.date_posted.strftime("%Y-%m-%d"),
        })

    return JsonResponse(data, safe=False)


# REVIEWS API
def reviews_api(request):
    reviews = CompanyReview.objects.select_related('company').all()

    data = []
    for review in reviews:
        data.append({
            "company": review.company.name,
            "role": review.role,
            "rating": review.rating,
            "pros": review.pros,
            "cons": review.cons,
            "interview_process": review.interview_process,
            "recommendation": review.recommendation,
            "skills_used": review.skills_used,
            "date_posted": review.date_posted.strftime("%Y-%m-%d"),
        })

    return JsonResponse(data, safe=False)


# COMPANIES API (OPTIMIZED)
def companies_api(request):
    cutoff = timezone.now().date() - timedelta(days=16)
    companies = Company.objects.filter(
        jobposting__date_posted__gte=cutoff
    ).annotate(
        avg_rating=Avg('reviews__rating'),
        review_count=Count('reviews'),
        job_count=Count('jobposting', filter=Q(jobposting__date_posted__gte=cutoff), distinct=True),
    ).distinct()

    search = request.GET.get('search')
    if search:
        companies = companies.filter(
            Q(name__icontains=search) |
            Q(location__icontains=search) |
            Q(jobposting__title__icontains=search) |
            Q(jobposting__roles__name__icontains=search)
        ).distinct()

    data = []
    for c in companies:
        active_jobs = c.jobposting_set.filter(date_posted__gte=cutoff).order_by('-date_posted')
        role_names = []
        for job in active_jobs.prefetch_related('roles'):
            for role in job.roles.all():
                if role.name not in role_names:
                    role_names.append(role.name)

        data.append({
            "id": c.id,
            "name": c.name,
            "location": c.location,
            "avg_rating": round(c.avg_rating or 0, 1),
            "review_count": c.review_count,
            "job_count": c.job_count,
            "open_roles": role_names,
            "job_titles": list(active_jobs.values_list('title', flat=True)),
        })

    return JsonResponse(data, safe=False)


# CERTIFICATIONS API
def certifications_api(request):
    """
    Get all certifications with optional filtering by role.
    Query params:
      - role: Filter by role name (e.g., "Front-End Developer")
    """
    certifications = Certification.objects.annotate(
        job_count=Count('jobposting')
    ).order_by('name')

    role = request.GET.get('role')
    if role:
        certifications = certifications.filter(roles__name__icontains=role).distinct()

    data = []
    for cert in certifications:
        data.append({
            "id": cert.id,
            "name": cert.name,
            "description": cert.description or "",
            "organization": cert.organization or "",
            "roles": [r.name for r in cert.roles.all()],
            "job_count": cert.job_count,
        })

    return JsonResponse(data, safe=False)


def certification_detail_api(request, cert_id):
    """
    Get detailed information about a specific certification.
    Includes related job postings that have this certification.
    """
    try:
        cert = Certification.objects.get(id=cert_id)
    except Certification.DoesNotExist:
        return JsonResponse({"error": "Certification not found"}, status=404)

    # Get all active job postings with this certification
    cutoff = timezone.now().date() - timedelta(days=16)
    jobs = JobPosting.objects.filter(
        certifications=cert,
        date_posted__gte=cutoff
    ).select_related('company').order_by('-date_posted')

    jobs_data = []
    for job in jobs:
        jobs_data.append({
            "id": str(job.id),
            "title": job.title,
            "company": {
                "id": job.company.id,
                "name": job.company.name,
            },
            "location": job.location,
            "date_posted": job.date_posted.strftime("%Y-%m-%d"),
        })

    data = {
        "id": cert.id,
        "name": cert.name,
        "description": cert.description or "",
        "organization": cert.organization or "",
        "roles": [r.name for r in cert.roles.all()],
        "job_postings": jobs_data,
    }

    return JsonResponse(data, safe=False)
