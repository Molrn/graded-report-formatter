from django.db import models
from datetime import datetime

class Report(models.Model):
    company = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateField(default=datetime.now)