from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("jobs", "0011_certification_official_url_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="JobApplication",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("status", models.CharField(choices=[("submitted", "Submitted"), ("reviewing", "Reviewing"), ("closed", "Closed")], default="submitted", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("job", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="applications", to="jobs.jobposting")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="job_applications", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name="jobapplication",
            constraint=models.UniqueConstraint(fields=("user", "job"), name="unique_job_application"),
        ),
    ]
