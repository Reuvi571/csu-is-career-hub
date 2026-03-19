from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import JobPosting
import json

def list_jobs(request):
    jobs = list(JobPosting.objects.values())
    return JsonResponse(jobs, safe=False)

@csrf_exempt
def create_job(request):
    if request.method == "POST":
        data = json.loads(request.body)

        job = JobPosting.objects.create(
            title=data["title"],
            company=data["company"],
            location=data.get("location", "Cleveland, OH")
        )

        return JsonResponse({"id": str(job.id)}, status=201)
    
@csrf_exempt
def update_job(request, job_id):
    if request.method == "PUT":
        try:
            job = JobPosting.objects.get(id=job_id)
            data = json.loads(request.body)

            job.title = data.get("title", job.title)
            job.company = data.get("company", job.company)
            job.location = data.get("location", job.location)
            job.save()

            return JsonResponse({"message": "updated"}, status=200)
        except JobPosting.DoesNotExist:
            return JsonResponse({"error": "not found"}, status=404)


@csrf_exempt
def delete_job(request, job_id):
    if request.method == "DELETE":
        try:
            job = JobPosting.objects.get(id=job_id)
            job.delete()
            return JsonResponse({"message": "deleted"}, status=200)
        except JobPosting.DoesNotExist:
            return JsonResponse({"error": "not found"}, status=404)