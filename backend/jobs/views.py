from django.shortcuts import render
from django.http import HttpResponse
from .models import JobPosting

def dashboard(request):
    jobs = JobPosting.objects.all().order_by('-date_posted')
    return render(request, 'index.html', {'jobs': jobs})

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
