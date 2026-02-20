
import os
import re

seeders_dir = r"c:/Users/Acer/Desktop/Faculty-LIst-Management/facultylist/database/seeders"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace table name in updateOrInsert for the Group/Major
    # Pattern: DB::table('ref_discipline_group') -> DB::table('ref_major_discipline')
    new_content = content.replace("DB::table('ref_discipline_group')", "DB::table('ref_major_discipline')")
    
    # 2. Replace column name in the array
    # Pattern: 'major_discipline_code' => -> 'discipline_group_code' =>
    # But only for the part intersecting the first replacement.
    # Note: 'ref_specific_discipline' also uses 'major_discipline_code', we likely WANT to keep that if it refers to the now-named 'ref_major_discipline'.
    # However, in the seeder, the first updateOrInsert (which was for ref_discipline_group) used 'major_discipline_code' to refer to the Parent (which was ref_major_discipline).
    # Now, we are inserting into 'ref_major_discipline' (Child), and we want to refer to 'ref_discipline_group' (Parent).
    # So the column should be 'discipline_group_code'.
    
    # We must be careful not to replace the 'major_discipline_code' inside 'ref_specific_discipline' blocks if that column name wasn't changed in that table.
    
    # Strategy: Replace 'major_discipline_code' ONLY if it appears closely after 'ref_major_discipline' (which we just replaced from ref_discipline_group).
    
    # Actually, simplistic replace might be dangerous. Let's do regex.
    
    # Regex to find the DB::table('ref_major_discipline')->...->(['major_discipline_code' => ...])
    # The seeder structure is usually:
    # DB::table('ref_discipline_group')->updateOrInsert(
    #     ['code' => $groupCode],
    #     [
    #         'major_discipline_code' => '38',
    
    # I replaced the table name. Now I need to replace the column name in that context.
    
    pattern = r"(DB::table\('ref_major_discipline'\)->updateOrInsert\s*\(\s*\[[^\]]+\]\s*,\s*\[\s*)'major_discipline_code'(\s*=>)"
    new_content = re.sub(pattern, r"\1'discipline_group_code'\2", new_content, flags=re.DOTALL)
    
    if new_content != content:
        print(f"Updating {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(seeders_dir):
    for file in files:
        if file.endswith("Seeder.php") and file != "MajorDisciplineSeeder.php" and file != "DatabaseSeeder.php" and file != "DisciplineGroupSeeder.php":
            process_file(os.path.join(root, file))
