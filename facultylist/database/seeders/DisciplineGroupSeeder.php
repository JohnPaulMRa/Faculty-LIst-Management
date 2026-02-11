<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DisciplineGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate generic discipline groups to ensure clean state
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('ref_discipline_group')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 14: EDUCATION SCIENCE AND TEACHER TRAINING - Moved to EducationScience/* seeders
        // 18: FINE AND APPLIED ARTS - Moved to FineAndAppliedArts/* seeders
        // 22: HUMANITIES - Moved to Humanities/* seeders
        // 26: RELIGION AND THEOLOGY - Moved to ReligionAndTheology/* seeders
        // 30: SOCIAL AND BEHAVIORAL SCIENCES - Moved to SocialAndBehavioralSciences/* seeders

        // 34: BUSINESS ADMINISTRATION AND RELATED - Moved to BusinessAdministrationAndRelated/* seeders
        // 38: LAW AND JURISPRUDENCE - Moved to LawAndJurisprudence/* seeders
        // 42: NATURAL SCIENCE - Moved to NaturalScience/* seeders
        // 46: MATHEMATICS - Moved to Mathematics/* seeders

        // 47: IT-RELATED - Moved to ITRelated/* seeders
        // 50: MEDICAL AND ALLIED - Moved to MedicalAndAllied/* seeders
        // 52: TRADE, CRAFT AND INDUSTRIAL - Moved to TradeCraftAndIndustrial/* seeders
        // 54: ENGINEERING - Moved to Engineering/* seeders

        // 58: ARCHITECTURAL AND TOWN-PLANNING - Moved to ArchitecturalAndTownPlanning/* seeders
        // 62: AGRICULTURAL, FORESTRY, AND FISHERIES - Moved to AgriculturalForestryAndFisheries/* seeders
        // 66: HOME ECONOMICS - Moved to HomeEconomics/* seeders
        // 78: SERVICE TRADES - Moved to ServiceTrades/* seeders

        // 84: MASS COMMUNICATION AND DOCUMENTATION - Moved to MassCommunicationAndDocumentation/* seeders
        // 89: OTHER DISCIPLINES - Moved to OtherDisciplines/* seeders
        // 90: MARITIME - Moved to Maritime/* seeders
        // 00: GENERAL - Moved to General/* seeders
    }
}
