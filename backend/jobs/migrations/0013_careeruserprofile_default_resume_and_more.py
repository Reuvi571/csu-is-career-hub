from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("jobs", "0012_jobapplication"),
    ]

    operations = [
        migrations.AddField(
            model_name="careeruserprofile",
            name="default_resume",
            field=models.FileField(blank=True, null=True, upload_to="resumes/defaults/"),
        ),
        migrations.AddField(
            model_name="jobapplication",
            name="cover_letter_file",
            field=models.FileField(blank=True, null=True, upload_to="applications/cover_letters/"),
        ),
        migrations.AddField(
            model_name="jobapplication",
            name="resume_file",
            field=models.FileField(blank=True, null=True, upload_to="applications/resumes/"),
        ),
    ]
