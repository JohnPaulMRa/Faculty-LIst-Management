
import os
import re

seeders_dir = r"c:/Users/Acer/Desktop/Faculty-LIst-Management/facultylist/database/seeders"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace 'major_discipline_code' => 'XX' with 'major_discipline_code' => $groupCode
    # BUT ONLY inside the loop for specific disciplines, or where it refers to ref_specific_discipline.
    # The structure is usually:
    # DB::table('ref_specific_discipline')->updateOrInsert(
    #    ...,
    #    [
    #        'major_discipline_code' => '14',
    
    # Regex to capture the specific line.
    # 'major_discipline_code' => '14',
    
    pattern = r"('major_discipline_code'\s*=>\s*)'[^']+'(\s*,)"
    
    # We need to be careful. The FIRST occurrence in seedGroup might be for ref_major_discipline (which we ALREADY changed to discipline_group_code).
    # Wait, my previous script changed:
    # 'major_discipline_code' => ...  TO  'discipline_group_code' => ...
    # BUT ONLY near `ref_major_discipline` (the one that was ref_discipline_group).
    
    # The `ref_specific_discipline` block still has `major_discipline_code`.
    # And it has the HARDCODED value.
    # We want to change THAT value to `$groupCode`.
    
    # So finding: 'major_discipline_code' => '14',
    # And replacing '14' with $groupCode.
    
    new_content = re.sub(pattern, r"\1$groupCode\2", content)
    
    if new_content != content:
        print(f"Updating {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(seeders_dir):
    for file in files:
        if file.endswith("Seeder.php") and file != "DatabaseSeeder.php":
            process_file(os.path.join(root, file))
