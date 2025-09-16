# mealplan/models.py
from django.db import models
from django.contrib.auth.models import User

class MealPlanItem(models.Model):
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mealplan_items", null=True, blank=True)
    recipe_id = models.IntegerField()   # Spoonacular recipe ID
    date = models.DateField()
    image = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=200)

    notes = models.TextField(blank=True)   
    
    def __str__(self):
        return f"{self.date}: {self.title}{self.name}"


