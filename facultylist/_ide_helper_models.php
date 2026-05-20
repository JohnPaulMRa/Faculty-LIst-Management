<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property int $is_active
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereUpdatedAt($value)
 */
	class AcademicYear extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $specific_discipline_code
 * @property string $program_name
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\RefSpecificDiscipline $specificDiscipline
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DisProgram newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DisProgram newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DisProgram query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DisProgram whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DisProgram whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DisProgram whereProgramName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DisProgram whereSpecificDisciplineCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DisProgram whereUpdatedAt($value)
 */
	class DisProgram extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Discipline newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Discipline newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Discipline query()
 */
	class Discipline extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $hei_id
 * @property string $name
 * @property string|null $email
 * @property string|null $department
 * @property string|null $rank
 * @property string|null $degree
 * @property string|null $status
 * @property string|null $employment
 * @property string|null $avatar_initials
 * @property string|null $joined_year
 * @property string|null $form_type
 * @property string|null $import_group
 * @property string|null $gender
 * @property string|null $is_tenured
 * @property string|null $college
 * @property string|null $salary_grade
 * @property string|null $annual_salary
 * @property string|null $on_leave
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property string|null $pursuing_degree
 * @property string|null $level_code
 * @property string|null $fte
 * @property string|null $discipline_load_1
 * @property string|null $discipline_load_2
 * @property string|null $discipline_bachelors
 * @property string|null $discipline_masters
 * @property string|null $discipline_doctorate
 * @property string|null $masters_thesis
 * @property string|null $doctorate_dissertation
 * @property string|null $ug_lab_units
 * @property string|null $ug_lec_units
 * @property string|null $ug_total_units
 * @property string|null $ug_lab_hours
 * @property string|null $ug_lec_hours
 * @property string|null $ug_total_hours
 * @property string|null $ug_lab_contact
 * @property string|null $ug_lec_contact
 * @property string|null $ug_total_contact
 * @property string|null $grad_lab_units
 * @property string|null $grad_lec_units
 * @property string|null $grad_total_units
 * @property string|null $grad_lab_contact
 * @property string|null $grad_lec_contact
 * @property string|null $grad_total_contact
 * @property string|null $load_research
 * @property string|null $load_extension
 * @property string|null $load_study
 * @property string|null $load_production
 * @property string|null $load_admin
 * @property string|null $load_others
 * @property string|null $load_total
 * @property-read \App\Models\Hei|null $hei
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereAnnualSalary($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereAvatarInitials($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereCollege($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereDegree($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereDepartment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereDisciplineBachelors($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereDisciplineDoctorate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereDisciplineLoad1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereDisciplineLoad2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereDisciplineMasters($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereDoctorateDissertation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereEmployment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereFormType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereFte($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereGradLabContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereGradLabUnits($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereGradLecContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereGradLecUnits($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereGradTotalContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereGradTotalUnits($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereHeiId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereImportGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereIsTenured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereJoinedYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereLevelCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereLoadAdmin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereLoadExtension($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereLoadOthers($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereLoadProduction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereLoadResearch($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereLoadStudy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereLoadTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereMastersThesis($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereOnLeave($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty wherePursuingDegree($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereRank($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereSalaryGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgLabContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgLabHours($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgLabUnits($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgLecContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgLecHours($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgLecUnits($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgTotalContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgTotalHours($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUgTotalUnits($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Faculty whereUpdatedAt($value)
 */
	class Faculty extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property string|null $avatar_initials
 * @property string|null $joined_year
 * @property string $form_type
 * @property string $status
 * @property string|null $employment
 * @property int|null $hei_id
 * @property string|null $import_group
 * @property string|null $discipline_code
 * @property string|null $bachelors_code
 * @property string|null $masters_code
 * @property string|null $doctorate_code
 * @property string|null $ft_pt_code
 * @property string|null $gender_code
 * @property string|null $highest_degree_code
 * @property string|null $license_code
 * @property string|null $tenure_code
 * @property string|null $rank_code
 * @property string|null $teaching_load_code
 * @property string|null $salary_range_code
 * @property string|null $subjects
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Hei|null $hei
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereAvatarInitials($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereBachelorsCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereDisciplineCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereDoctorateCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereEmployment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereFormType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereFtPtCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereGenderCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereHeiId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereHighestDegreeCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereImportGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereJoinedYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereLicenseCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereMastersCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereRankCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereSalaryRangeCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereSubjects($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereTeachingLoadCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereTenureCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FacultyE5 whereUpdatedAt($value)
 */
	class FacultyE5 extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $type
 * @property string|null $hei_code
 * @property string|null $address
 * @property string|null $contact_number
 * @property string|null $email
 * @property bool $is_active
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Faculty> $faculties
 * @property-read int|null $faculties_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FacultyE5> $facultiesE5
 * @property-read int|null $faculties_e5_count
 * @property-read \App\Models\HeiSubmission|null $latestSubmission
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereContactNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereHeiCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Hei whereUpdatedAt($value)
 */
	class Hei extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $hei_id
 * @property string $hei_name
 * @property string $academic_year
 * @property string $submitted_by
 * @property int $total_faculty
 * @property string $status
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Hei|null $hei
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereAcademicYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereHeiId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereHeiName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereSubmittedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereTotalFaculty($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HeiSubmission whereUpdatedAt($value)
 */
	class HeiSubmission extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $code
 * @property string $description
 * @property string|null $slug
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefDisciplineGroup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefDisciplineGroup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefDisciplineGroup query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefDisciplineGroup whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefDisciplineGroup whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefDisciplineGroup whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefDisciplineGroup whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefDisciplineGroup whereUpdatedAt($value)
 */
	class RefDisciplineGroup extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $code
 * @property string $description
 * @property string|null $slug
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RefSpecificDiscipline> $specificDisciplines
 * @property-read int|null $specific_disciplines_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefMajorDiscipline newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefMajorDiscipline newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefMajorDiscipline query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefMajorDiscipline whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefMajorDiscipline whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefMajorDiscipline whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefMajorDiscipline whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefMajorDiscipline whereUpdatedAt($value)
 */
	class RefMajorDiscipline extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $code
 * @property string $description
 * @property string|null $slug
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property string|null $group_code
 * @property string|null $major_code
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DisProgram> $programs
 * @property-read int|null $programs_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline whereGroupCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline whereMajorCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefSpecificDiscipline whereUpdatedAt($value)
 */
	class RefSpecificDiscipline extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReferenceData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReferenceData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReferenceData query()
 */
	class ReferenceData extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $hei_id
 * @property string $name
 * @property string $email
 * @property \Carbon\CarbonImmutable|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property \Carbon\CarbonImmutable|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Hei|null $hei
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereHeiId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorConfirmedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorRecoveryCodes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorSecret($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

