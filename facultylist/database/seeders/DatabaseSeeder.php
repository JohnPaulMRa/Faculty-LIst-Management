<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        \App\Models\School::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Test School',
                'code' => 'TS001',
                'is_active' => true,
                'type' => 'Private', // or Public
            ]
        );

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'school_id' => 1,
                'password' => bcrypt('password'), // Ensure password is set if creating
                'role' => 'Faculty',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'school_id' => 1,
                'password' => bcrypt('password'),
                'role' => 'Admin',
            ]
        );

        $this->call([
            E5ReferenceDataSeeder::class, // Added to seed E5 reference tables
            AcademicYearSeeder::class,
            E5FullTimePartTimeSeeder::class, // Added specific seeder for full/part time
            MajorDisciplineSeeder::class,
            DisciplineGroupSeeder::class, // Still needed for other major disciplines
            SpecificDisciplineSeeder::class, // Still needed for other major disciplines

                // Education Science and Teacher Training
            EducationScienceAndTeacherTraining\GeneralTeacherTrainingSeeder::class,
            EducationScienceAndTeacherTraining\TeacherTrainingNonVocationalSubjectSeeder::class,
            EducationScienceAndTeacherTraining\TeacherTrainingPracticalVocationalSeeder::class,
            EducationScienceAndTeacherTraining\TeacherTrainingPreschoolKindergartenSeeder::class,
            EducationScienceAndTeacherTraining\TeacherTrainingAdultEducationSeeder::class,
            EducationScienceAndTeacherTraining\EducationScienceSupportTeachingSeeder::class,
            EducationScienceAndTeacherTraining\EducationalAdministrationSupervisionSeeder::class,
            EducationScienceAndTeacherTraining\OtherEducationScienceTeacherTrainingSeeder::class,
            EducationScienceAndTeacherTraining\OtherEducationScienceTeacherTrainingSeeder::class,

                // Fine and Applied Arts
            FineAndAppliedArts\GeneralArtStudiesSeeder::class,
            FineAndAppliedArts\PracticalArtsSeeder::class,
            FineAndAppliedArts\DrawingAndPaintingSeeder::class,
            FineAndAppliedArts\SculpturingSeeder::class,
            FineAndAppliedArts\MusicSeeder::class,
            FineAndAppliedArts\DramaSeeder::class,
            FineAndAppliedArts\OtherFineAndAppliedArtsSeeder::class,

                // Humanities
            Humanities\GeneralHumanitiesSeeder::class,
            Humanities\CurrentOrVernacularLanguageAndItsLiteratureSeeder::class,
            Humanities\OtherLivingLanguagesAndTheirLiteratureSeeder::class,
            Humanities\DeadLanguagesAndTheirLiteratureSeeder::class,
            Humanities\LinguisticsSeeder::class,
            Humanities\ComparativeLiteratureSeeder::class,
            Humanities\HistorySeeder::class,
            Humanities\ArcheologySeeder::class,
            Humanities\PhilosophySeeder::class,
            Humanities\OtherHumanitiesSeeder::class,

                // Religion and Theology
            ReligionAndTheology\ReligionAndTheologySeeder::class,

                // Social and Behavioral Sciences
            SocialAndBehavioralSciences\GeneralSocialAndBehavioralSciencesSeeder::class,
            SocialAndBehavioralSciences\EconomicsSeeder::class,
            SocialAndBehavioralSciences\PoliticalScienceSeeder::class,
            SocialAndBehavioralSciences\SociologySeeder::class,
            SocialAndBehavioralSciences\DemographySeeder::class,
            SocialAndBehavioralSciences\AnthropologySeeder::class,
            SocialAndBehavioralSciences\PsychologySeeder::class,
            SocialAndBehavioralSciences\GeographySeeder::class,
            SocialAndBehavioralSciences\StudiesOfRegionalCulturesSeeder::class,
            SocialAndBehavioralSciences\OtherSocialAndBehavioralScienceSeeder::class,

                // Business Administration and Related
            BusinessAdministrationAndRelated\GeneralBusinessAdministrationSeeder::class,
            BusinessAdministrationAndRelated\SecretarialSeeder::class,
            BusinessAdministrationAndRelated\ElectronicDataProcessingSeeder::class,
            BusinessAdministrationAndRelated\AccountancySeeder::class,
            BusinessAdministrationAndRelated\BusinessAdministrationMarketingSeeder::class,
            BusinessAdministrationAndRelated\BusinessAdministrationFinanceSeeder::class,
            BusinessAdministrationAndRelated\BusinessAdministrationOtherSpecializationSeeder::class,
            BusinessAdministrationAndRelated\PublicAdministrationSeeder::class,
            BusinessAdministrationAndRelated\InstitutionalAdministrationManagementSeeder::class,
            BusinessAdministrationAndRelated\OtherAdministrationManagementSeeder::class,

                // Law and Jurisprudence
            LawAndJurisprudence\GeneralLawSeeder::class,
            LawAndJurisprudence\JurisprudenceAndHistoryOfLawSeeder::class,
            LawAndJurisprudence\InternationalLawSeeder::class,
            LawAndJurisprudence\LaborLawSeeder::class,
            LawAndJurisprudence\MaritimeLawSeeder::class,
            LawAndJurisprudence\OtherLawAndJurisprudenceSeeder::class,

                // Natural Science
            NaturalScience\BiologicalScienceSeeder::class,
            NaturalScience\ChemistrySeeder::class,
            NaturalScience\GeologicalScienceSeeder::class,
            NaturalScience\PhysicsSeeder::class,
            NaturalScience\AstronomySeeder::class,
            NaturalScience\MeteorologySeeder::class,
            NaturalScience\OceanographySeeder::class,
            NaturalScience\OtherNaturalAppliedScienceSeeder::class,

                // Mathematics
            Mathematics\GeneralMathematicsSeeder::class,
            Mathematics\StatisticsSeeder::class,
            Mathematics\ActuarialScienceSeeder::class,
            Mathematics\OtherMathematicsSeeder::class,

                // IT-Related
            ITRelated\ComputerScienceInformationTechnologySeeder::class,

                // Medical and Allied
            MedicalAndAllied\HygieneSeeder::class,
            MedicalAndAllied\MedicineSeeder::class,
            MedicalAndAllied\RehabilitationMedicineSeeder::class,
            MedicalAndAllied\NursingSeeder::class,
            MedicalAndAllied\MidwiferySeeder::class,
            MedicalAndAllied\MedicalXRayTechniquesSeeder::class,
            MedicalAndAllied\MedicalTechnologySeeder::class,
            MedicalAndAllied\DentalMedicineSeeder::class,
            MedicalAndAllied\PharmacySeeder::class,
            MedicalAndAllied\OptometrySeeder::class,
            MedicalAndAllied\NutritionAndDieteticsSeeder::class,
            MedicalAndAllied\OtherMedicalDiagnosticAndTreatmentSeeder::class,

                // Trade, Craft and Industrial
            TradeCraftAndIndustrial\ClothingAndRelatedTradesSeeder::class,

                // Engineering
            Engineering\AeronauticalEngineeringSeeder::class,
            Engineering\AgriculturalEngineeringSeeder::class,
            Engineering\BasicEngineeringSeeder::class,
            Engineering\ChemicalEngineeringSeeder::class,
            Engineering\CivilEngineeringSeeder::class,
            Engineering\ElectricalElectronicsAndComputerEngineeringSeeder::class,
            Engineering\ForestryEngineeringSeeder::class,
            Engineering\GeodeticEngineeringSeeder::class,
            Engineering\IndustrialEngineeringSeeder::class,
            Engineering\MechanicalEngineeringSeeder::class,
            Engineering\MetallurgicalEngineeringSeeder::class,
            Engineering\MiningEngineeringSeeder::class,
            Engineering\OtherEngineeringSeeder::class,
            Engineering\SanitaryEngineeringSeeder::class,

                // Architectural and Town-Planning
            ArchitecturalAndTownPlanning\GeneralArchitectureAndTownPlanningSeeder::class,
            ArchitecturalAndTownPlanning\ArchitecturalDesignSeeder::class,
            ArchitecturalAndTownPlanning\LandscapeArchitectureSeeder::class,
            ArchitecturalAndTownPlanning\TownPlanningSeeder::class,

                // Agricultural, Forestry, and Fisheries
            AgriculturalForestryAndFisheries\AnimalHusbandrySeeder::class,
            AgriculturalForestryAndFisheries\HorticultureSeeder::class,
            AgriculturalForestryAndFisheries\AgronomySeeder::class,
            AgriculturalForestryAndFisheries\AgriculturalEconomicsSeeder::class,
            AgriculturalForestryAndFisheries\FoodSciencesAndTechnologySeeder::class,
            AgriculturalForestryAndFisheries\SoilAndWaterSciencesSeeder::class,
            AgriculturalForestryAndFisheries\VeterinaryMedicineSeeder::class,
            AgriculturalForestryAndFisheries\OtherAgricultureSeeder::class,
            AgriculturalForestryAndFisheries\ForestrySeeder::class,
            AgriculturalForestryAndFisheries\FisheryScienceAndTechnologySeeder::class,

                // Maritime
            Maritime\MarineEngineeringSeeder::class,
            Maritime\NauticalScienceSeeder::class,

                // Home Economics
            HomeEconomics\GeneralHomeEconomicsSeeder::class,
            HomeEconomics\HouseholdAndConsumerFoodResearchSeeder::class,
            HomeEconomics\HouseholdArtsSeeder::class,
            HomeEconomics\OtherHomeEconomicsSeeder::class,

                // Service Trades
            ServiceTrades\ServiceTradesSeeder::class,

                // Mass Communication and Documentation
            MassCommunicationAndDocumentation\GeneralCommunicationArtsSeeder::class,
            MassCommunicationAndDocumentation\JournalismSeeder::class,
            MassCommunicationAndDocumentation\RadioAndTelevisionBroadcastingSeeder::class,
            MassCommunicationAndDocumentation\PublicRelationsAndMediaManagementSeeder::class,
            MassCommunicationAndDocumentation\OtherCommunicationsArtsSeeder::class,
            MassCommunicationAndDocumentation\LibraryScienceSeeder::class,

                // Other Disciplines
            OtherDisciplines\CriminologySeeder::class,
            OtherDisciplines\OtherCivilSecurityAndMilitarySeeder::class,
            OtherDisciplines\SocialWelfareSeeder::class,
            OtherDisciplines\CommunityDevelopmentSeeder::class,
            OtherDisciplines\EnvironmentalStudiesSeeder::class,
            OtherDisciplines\HumanResourceDevelopmentSeeder::class,
            OtherDisciplines\WomenDevelopmentSeeder::class,
            OtherDisciplines\OtherEducationNECSeeder::class,

                // General
            General\GeneralDisciplinesSeeder::class,
        ]);
    }
}
