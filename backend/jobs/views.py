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