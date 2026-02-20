
import os
import re

seeders_dir = r"c:/Users/Acer/Desktop/Faculty-LIst-Management/facultylist/database/seeders"
database_seeder_path = os.path.join(seeders_dir, "DatabaseSeeder.php")

# Read DatabaseSeeder.php
with open(database_seeder_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract used classes with their namespaces
# Matches things like: EducationScienceAndTeacherTraining\GeneralTeacherTrainingSeeder::class
matches = re.findall(r'([a-zA-Z0-9\\]+Seeder)::class', content)

used_files = set()
for match in matches:
    # Convert namespace to path
    # e.g. EducationScienceAndTeacherTraining\GeneralTeacherTrainingSeeder -> EducationScienceAndTeacherTraining/GeneralTeacherTrainingSeeder.php
    relative_path = match.replace('\\', '/') + ".php"
    full_path = os.path.join(seeders_dir, relative_path).replace('\\', '/')
    used_files.add(full_path.lower())

# Add DatabaseSeeder itself
used_files.add(database_seeder_path.replace('\\', '/').lower())

files_to_delete = []
dirs_to_delete = []

# Walk files to find unused ones
for root, dirs, files in os.walk(seeders_dir):
    for file in files:
        if file.endswith(".php"):
            full_path = os.path.join(root, file).replace('\\', '/')
            if full_path.lower() not in used_files:
                files_to_delete.append(full_path)

# Walk directories bottom-up to find empty/unused ones
for root, dirs, files in os.walk(seeders_dir, topdown=False):
    for dir_name in dirs:
        dir_path = os.path.join(root, dir_name).replace('\\', '/')
        
        # Check if directory contains any *used* files
        has_used_files = False
        for r, d, f in os.walk(dir_path):
            for file in f:
                file_path = os.path.join(r, file).replace('\\', '/')
                if file_path.lower() in used_files:
                    has_used_files = True
                    break
            if has_used_files:
                break
        
        if not has_used_files:
            dirs_to_delete.append(dir_path)

with open("deletion_list.txt", "w") as f:
    f.write("FILES_TO_DELETE:\n")
    for file in files_to_delete:
        f.write(file + "\n")
    f.write("\nDIRS_TO_DELETE:\n")
    for dir in dirs_to_delete:
        f.write(dir + "\n")

print(f"Found {len(files_to_delete)} files and {len(dirs_to_delete)} directories to delete.")
