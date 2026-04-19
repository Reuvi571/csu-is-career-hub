from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("jobs", "0010_careeruserprofile_bio_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="certification",
            name="official_url",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="jobposting",
            name="application_type",
            field=models.CharField(default="company_site", max_length=50),
        ),
        migrations.AddField(
            model_name="jobposting",
            name="apply_url",
            field=models.URLField(blank=True, default=""),
        ),
    ]
