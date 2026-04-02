from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import JobPosting, CompanyReview, Company
from datetime import timedelta
from django.utils import timezone
from django.db.models import Q, Avg, Count


# =========================
# DASHBOARD
# =========================
def dashboard(request):
    cutoff = timezone.now().date() - timedelta(days=16)
    jobs = JobPosting.objects.filter(date_posted__gte=cutoff).order_by('-date_posted')
    return render(request, 'index.html', {'jobs': jobs})


# =========================
# MDN POPUP
# =========================
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


# =========================
# JOBS API
# =========================
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
            "skills": job.skills_required,
            "certs_text": job.certs_recommended,
            "certifications": [c.name for c in job.certifications.all()],
            "roles": [r.name for r in job.roles.all()],
            "date_posted": job.date_posted.strftime("%Y-%m-%d"),
        })

    return JsonResponse(data, safe=False)


# =========================
# REVIEWS API
# =========================
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


# =========================
# COMPANIES API (OPTIMIZED)
# =========================
def companies_api(request):
    companies = Company.objects.all().annotate(
        avg_rating=Avg('reviews__rating'),
        review_count=Count('reviews'),
        job_count=Count('jobposting')
    )

    search = request.GET.get('search')
    if search:
        companies = companies.filter(name__icontains=search)

    data = []
    for c in companies:
        data.append({
            "id": c.id,
            "name": c.name,
            "location": c.location,
            "avg_rating": round(c.avg_rating or 0, 1),
            "review_count": c.review_count,
            "job_count": c.job_count,
        })

    return JsonResponse(data, safe=False)