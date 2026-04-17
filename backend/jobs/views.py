from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import JobPosting, CompanyReview, Company, Certification, SalaryReport, CareerUserProfile
from datetime import timedelta
from django.utils import timezone
from django.db.models import Q, Avg, Count
from decimal import Decimal
from django.contrib.auth import get_user_model, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json


User = get_user_model()


def format_hourly_range(min_rate, max_rate):
    if min_rate is None and max_rate is None:
        return ""

    if min_rate == max_rate:
        return f"${min_rate:.0f}/hr"

    return f"${min_rate:.0f}/hr - ${max_rate:.0f}/hr"


def midpoint_hourly_rate(min_rate, max_rate):
    if min_rate is None or max_rate is None:
        return None

    return float((Decimal(min_rate) + Decimal(max_rate)) / 2)


def serialize_user(user):
    profile = getattr(user, "career_profile", None)
    return {
        "id": user.id,
        "name": user.get_full_name() or user.username or user.email,
        "email": user.email,
        "role": profile.role if profile else "student",
        "graduationYear": profile.graduation_year if profile else None,
        "major": profile.major if profile else "",
    }


def serialize_review(review):
    reviewer = review.user
    profile = getattr(reviewer, "career_profile", None) if reviewer else None
    reviewer_name = reviewer.get_full_name() if reviewer and reviewer.get_full_name() else (reviewer.email if reviewer else "CSU Student")

    return {
        "id": review.id,
        "company": {
            "id": review.company.id,
            "name": review.company.name,
        },
        "role": review.role,
        "rating": review.rating,
        "pros": review.pros,
        "cons": review.cons,
        "interview_process": review.interview_process,
        "recommendation": review.recommendation,
        "skills_used": [skill.strip() for skill in review.skills_used.split(",") if skill.strip()],
        "date_posted": review.date_posted.strftime("%Y-%m-%d"),
        "status": review.status,
        "reviewer": {
            "name": reviewer_name,
            "role": profile.role if profile else "student",
            "graduationYear": profile.graduation_year if profile else None,
        },
    }


def serialize_job(job):
    return {
        "id": str(job.id),
        "title": job.title,
        "company": {
            "id": job.company.id,
            "name": job.company.name,
        },
        "location": job.location,
        "description": job.description or "",
        "experience_level": job.experience_level,
        "position_type": job.position_type,
        "min_hourly_rate": float(job.min_hourly_rate) if job.min_hourly_rate is not None else None,
        "max_hourly_rate": float(job.max_hourly_rate) if job.max_hourly_rate is not None else None,
        "salary_range": format_hourly_range(job.min_hourly_rate, job.max_hourly_rate),
        "certifications": [c.name for c in job.certifications.all()],
        "roles": [r.name for r in job.roles.all()],
        "date_posted": job.date_posted.strftime("%Y-%m-%d"),
        "status": job.status,
        "rejection_note": job.rejection_note,
    }


def is_admin(user):
    if not user.is_authenticated:
        return False

    profile = getattr(user, "career_profile", None)
    return bool(profile and profile.role == "admin")


# DASHBOARD
def dashboard(request):
    cutoff = timezone.now().date() - timedelta(days=16)
    jobs = JobPosting.objects.filter(date_posted__gte=cutoff, status="published").order_by('-date_posted')
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
    jobs = JobPosting.objects.filter(date_posted__gte=cutoff, status="published").order_by('-date_posted')

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

    return JsonResponse([serialize_job(job) for job in jobs], safe=False)


# REVIEWS API
def reviews_api(request):
    reviews = CompanyReview.objects.select_related('company', 'user', 'user__career_profile').filter(status="approved")
    return JsonResponse([serialize_review(review) for review in reviews], safe=False)


# SALARIES API
def salaries_api(request):
    company_id = request.GET.get("company")
    position_type = request.GET.get("position_type")
    cutoff = timezone.now().date() - timedelta(days=16)

    current_jobs = JobPosting.objects.select_related("company").filter(
        date_posted__gte=cutoff,
        status="published",
        min_hourly_rate__isnull=False,
        max_hourly_rate__isnull=False,
    ).order_by("-date_posted", "company__name", "title")

    historical_reports = SalaryReport.objects.select_related("company").order_by("year", "position_type")

    if company_id:
        current_jobs = current_jobs.filter(company_id=company_id)

    if position_type:
        current_jobs = current_jobs.filter(position_type=position_type)
        historical_reports = historical_reports.filter(position_type=position_type)

    current_postings = []
    for job in current_jobs:
        current_postings.append({
            "id": str(job.id),
            "title": job.title,
            "company": {
                "id": job.company.id,
                "name": job.company.name,
            },
            "position_type": job.position_type,
            "experience_level": job.experience_level,
            "min_hourly_rate": float(job.min_hourly_rate),
            "max_hourly_rate": float(job.max_hourly_rate),
            "midpoint_hourly_rate": midpoint_hourly_rate(job.min_hourly_rate, job.max_hourly_rate),
            "salary_range": format_hourly_range(job.min_hourly_rate, job.max_hourly_rate),
            "date_posted": job.date_posted.strftime("%Y-%m-%d"),
        })

    historical_snapshots = []
    for report in historical_reports:
        historical_snapshots.append({
            "id": report.id,
            "company": {
                "id": report.company.id,
                "name": report.company.name,
            } if report.company else None,
            "role": report.role,
            "position_type": report.position_type,
            "year": report.year,
            "avg_hourly_rate": float(report.avg_hourly_rate),
            "min_hourly_rate": float(report.min_hourly_rate),
            "max_hourly_rate": float(report.max_hourly_rate),
            "posting_count": report.posting_count,
        })

    return JsonResponse({
        "current_postings": current_postings,
        "historical_snapshots": historical_snapshots,
    })


# COMPANIES API (OPTIMIZED)
def companies_api(request):
    cutoff = timezone.now().date() - timedelta(days=16)
    companies = Company.objects.filter(
        jobposting__date_posted__gte=cutoff,
        jobposting__status="published",
    ).annotate(
        avg_rating=Avg('reviews__rating', filter=Q(reviews__status="approved")),
        review_count=Count('reviews', filter=Q(reviews__status="approved")),
        job_count=Count('jobposting', filter=Q(jobposting__date_posted__gte=cutoff, jobposting__status="published"), distinct=True),
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
        active_jobs = c.jobposting_set.filter(date_posted__gte=cutoff, status="published").order_by('-date_posted')
        role_names = []
        for job in active_jobs.prefetch_related('roles'):
            for role in job.roles.all():
                if role.name not in role_names:
                    role_names.append(role.name)

        data.append({
            "id": c.id,
            "name": c.name,
            "location": c.location,
            "industry": c.industry,
            "size": c.size,
            "website": c.website,
            "description": c.description,
            "avg_rating": round(c.avg_rating or 0, 1),
            "review_count": c.review_count,
            "job_count": c.job_count,
            "open_roles": role_names,
            "job_titles": list(active_jobs.values_list('title', flat=True)),
        })

    return JsonResponse(data, safe=False)


def company_detail_api(request, company_id):
    cutoff = timezone.now().date() - timedelta(days=16)

    try:
        company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return JsonResponse({"error": "Company not found"}, status=404)

    reviews = CompanyReview.objects.select_related("user", "user__career_profile").filter(
        company=company,
        status="approved",
    ).order_by("-date_posted")
    jobs = JobPosting.objects.filter(
        company=company,
        date_posted__gte=cutoff,
        status="published",
    ).prefetch_related("roles", "certifications").order_by("-date_posted")

    open_roles = []
    certifications = []
    salary_midpoints = []
    job_data = []

    for job in jobs:
        for role in job.roles.all():
            if role.name not in open_roles:
                open_roles.append(role.name)

        for cert in job.certifications.all():
            if cert.name not in certifications:
                certifications.append(cert.name)

        midpoint = midpoint_hourly_rate(job.min_hourly_rate, job.max_hourly_rate)
        if midpoint is not None:
            salary_midpoints.append(midpoint)

        job_data.append({
            "id": str(job.id),
            "title": job.title,
            "location": job.location,
            "experience_level": job.experience_level,
            "position_type": job.position_type,
            "salary_range": format_hourly_range(job.min_hourly_rate, job.max_hourly_rate),
            "date_posted": job.date_posted.strftime("%Y-%m-%d"),
            "roles": [role.name for role in job.roles.all()],
            "certifications": [cert.name for cert in job.certifications.all()],
        })

    review_data = [serialize_review(review) for review in reviews]

    avg_rating = 0
    if review_data:
        avg_rating = round(sum(review["rating"] for review in review_data) / len(review_data), 1)

    salary_summary = {
        "avg_midpoint": round(sum(salary_midpoints) / len(salary_midpoints), 1) if salary_midpoints else 0,
        "min_rate": round(min((job.min_hourly_rate for job in jobs if job.min_hourly_rate is not None), default=0), 1),
        "max_rate": round(max((job.max_hourly_rate for job in jobs if job.max_hourly_rate is not None), default=0), 1),
    }

    data = {
        "id": company.id,
        "name": company.name,
        "location": company.location,
        "industry": company.industry,
        "size": company.size,
        "website": company.website,
        "description": company.description,
        "avg_rating": avg_rating,
        "review_count": len(review_data),
        "job_count": len(job_data),
        "open_roles": open_roles,
        "certifications": certifications,
        "salary_summary": salary_summary,
        "jobs": job_data,
        "reviews": review_data,
    }

    return JsonResponse(data)


@csrf_exempt
@require_http_methods(["POST"])
def login_api(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = payload.get("email", "").strip().lower()
    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Email not found"}, status=404)

    login(request, user, backend="django.contrib.auth.backends.ModelBackend")
    return JsonResponse({"user": serialize_user(user)})


@csrf_exempt
@require_http_methods(["POST"])
def logout_api(request):
    logout(request)
    return JsonResponse({"success": True})


def current_user_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({"user": None})

    return JsonResponse({"user": serialize_user(request.user)})


@csrf_exempt
@require_http_methods(["POST"])
def submit_review_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    required_fields = ["company_id", "role", "rating", "pros", "cons", "interview_process", "recommendation"]
    missing_fields = [field for field in required_fields if not payload.get(field)]
    if missing_fields:
        return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

    try:
        company = Company.objects.get(id=payload["company_id"])
    except Company.DoesNotExist:
        return JsonResponse({"error": "Company not found"}, status=404)

    review = CompanyReview.objects.create(
        company=company,
        user=request.user,
        role=payload["role"],
        rating=float(payload["rating"]),
        pros=payload["pros"],
        cons=payload["cons"],
        interview_process=payload["interview_process"],
        recommendation=payload["recommendation"],
        skills_used=", ".join(payload.get("skills_used", [])),
        status="pending",
    )

    return JsonResponse({"review": serialize_review(review)}, status=201)


def admin_reviews_api(request):
    if not is_admin(request.user):
        return JsonResponse({"error": "Admin access required"}, status=403)

    pending = CompanyReview.objects.select_related("company", "user", "user__career_profile").filter(status="pending").order_by("-date_posted")
    approved = CompanyReview.objects.select_related("company", "user", "user__career_profile").filter(status="approved").order_by("-date_posted")
    companies_count = Company.objects.count()

    return JsonResponse({
        "pending": [serialize_review(review) for review in pending],
        "approved": [serialize_review(review) for review in approved],
        "stats": {
            "pending_reviews": pending.count(),
            "approved_reviews": approved.count(),
            "total_companies": companies_count,
        },
    })


def admin_jobs_api(request):
    if not is_admin(request.user):
        return JsonResponse({"error": "Admin access required"}, status=403)

    cutoff = timezone.now().date() - timedelta(days=16)
    published_jobs = JobPosting.objects.select_related("company").prefetch_related("roles", "certifications").filter(
        date_posted__gte=cutoff,
        status="published",
    ).order_by("-date_posted")
    rejected_jobs = JobPosting.objects.select_related("company").prefetch_related("roles", "certifications").filter(
        status="rejected",
    ).order_by("-rejected_at", "-date_posted")

    return JsonResponse({
        "published": [serialize_job(job) for job in published_jobs],
        "rejected": [serialize_job(job) for job in rejected_jobs],
    })


@csrf_exempt
@require_http_methods(["POST"])
def moderate_review_api(request, review_id):
    if not is_admin(request.user):
        return JsonResponse({"error": "Admin access required"}, status=403)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    action = payload.get("action")
    if action not in {"approve", "reject"}:
        return JsonResponse({"error": "Invalid action"}, status=400)

    try:
        review = CompanyReview.objects.select_related("company", "user", "user__career_profile").get(id=review_id)
    except CompanyReview.DoesNotExist:
        return JsonResponse({"error": "Review not found"}, status=404)

    review.status = "approved" if action == "approve" else "rejected"
    review.moderated_by = request.user
    review.moderated_at = timezone.now()
    review.save(update_fields=["status", "moderated_by", "moderated_at"])

    return JsonResponse({"review": serialize_review(review)})


@csrf_exempt
@require_http_methods(["POST"])
def moderate_job_api(request, job_id):
    if not is_admin(request.user):
        return JsonResponse({"error": "Admin access required"}, status=403)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    action = payload.get("action")
    if action not in {"reject", "restore"}:
        return JsonResponse({"error": "Invalid action"}, status=400)

    try:
        job = JobPosting.objects.select_related("company").prefetch_related("roles", "certifications").get(id=job_id)
    except JobPosting.DoesNotExist:
        return JsonResponse({"error": "Job not found"}, status=404)

    if action == "reject":
        job.status = "rejected"
        job.rejection_note = payload.get("note", "").strip()
        job.rejected_by = request.user
        job.rejected_at = timezone.now()
    else:
        job.status = "published"
        job.rejection_note = ""
        job.rejected_by = None
        job.rejected_at = None

    job.save(update_fields=["status", "rejection_note", "rejected_by", "rejected_at"])
    return JsonResponse({"job": serialize_job(job)})


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
