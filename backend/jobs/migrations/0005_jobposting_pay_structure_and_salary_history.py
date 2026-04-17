import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("jobs", "0004_salaryreport"),
    ]

    operations = [
        migrations.AddField(
            model_name="jobposting",
            name="max_hourly_rate",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True),
        ),
        migrations.AddField(
            model_name="jobposting",
            name="min_hourly_rate",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True),
        ),
        migrations.AddField(
            model_name="jobposting",
            name="position_type",
            field=models.CharField(
                choices=[
                    ("internship", "Internship"),
                    ("co_op", "Co-op"),
                    ("part_time", "Part-time"),
                    ("entry_level", "Entry-level"),
                ],
                default="entry_level",
                max_length=50,
            ),
        ),
        migrations.RemoveField(
            model_name="jobposting",
            name="salary_range",
        ),
        migrations.AddField(
            model_name="salaryreport",
            name="avg_hourly_rate",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=6),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="salaryreport",
            name="max_hourly_rate",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=6),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="salaryreport",
            name="min_hourly_rate",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=6),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="salaryreport",
            name="posting_count",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name="salaryreport",
            name="company",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="salary_reports", to="jobs.company"),
        ),
        migrations.AlterField(
            model_name="salaryreport",
            name="role",
            field=models.CharField(blank=True, default="", max_length=200),
        ),
        migrations.RemoveField(
            model_name="salaryreport",
            name="benefits",
        ),
        migrations.RemoveField(
            model_name="salaryreport",
            name="hourly_rate",
        ),
        migrations.RemoveField(
            model_name="salaryreport",
            name="is_verified",
        ),
    ]
