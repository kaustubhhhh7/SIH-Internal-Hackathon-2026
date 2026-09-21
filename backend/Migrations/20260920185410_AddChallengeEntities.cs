using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GovPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class AddChallengeEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Users_HeadUserId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_HeadUserId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Challenges_ChallengeId",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "HeadUserId",
                table: "Departments");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Challenges",
                newName: "TitleMarathi");

            migrationBuilder.RenameColumn(
                name: "Timeline",
                table: "Challenges",
                newName: "TitleEnglish");

            migrationBuilder.RenameColumn(
                name: "SubmissionDeadline",
                table: "Challenges",
                newName: "SubmissionOpeningDate");

            migrationBuilder.RenameColumn(
                name: "ProblemStatement",
                table: "Challenges",
                newName: "TargetBeneficiaries");

            migrationBuilder.RenameColumn(
                name: "PilotExpectations",
                table: "Challenges",
                newName: "Sector");

            migrationBuilder.RenameColumn(
                name: "IpRequirements",
                table: "Challenges",
                newName: "ProcurementExpectation");

            migrationBuilder.RenameColumn(
                name: "EvaluationCriteria",
                table: "Challenges",
                newName: "ProblemStatementMarathi");

            migrationBuilder.RenameColumn(
                name: "DesiredOutcome",
                table: "Challenges",
                newName: "ProblemStatementEnglish");

            migrationBuilder.RenameColumn(
                name: "ChallengeId",
                table: "Challenges",
                newName: "PilotDuration");

            migrationBuilder.RenameColumn(
                name: "BudgetFundingInformation",
                table: "Challenges",
                newName: "IntellectualPropertyRequirements");

            migrationBuilder.RenameColumn(
                name: "Background",
                table: "Challenges",
                newName: "GeographicScope");

            migrationBuilder.AddColumn<Guid>(
                name: "DepartmentId",
                table: "Users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BackgroundEnglish",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BackgroundMarathi",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChallengeReferenceNumber",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedAt",
                table: "Challenges",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentSituation",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DesiredOutcomeEnglish",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DesiredOutcomeMarathi",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "EstimatedBudget",
                table: "Challenges",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FunctionalRequirements",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FundingType",
                table: "Challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Challenges",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PilotRequirement",
                table: "Challenges",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedAt",
                table: "Challenges",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmissionClosingDate",
                table: "Challenges",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Challenges",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ChallengeApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChallengeId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartupProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChallengeApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChallengeApplications_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChallengeApplications_StartupProfiles_StartupProfileId",
                        column: x => x.StartupProfileId,
                        principalTable: "StartupProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChallengeTechnologyCategories",
                columns: table => new
                {
                    ChallengeId = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnologyCategoryId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChallengeTechnologyCategories", x => new { x.ChallengeId, x.TechnologyCategoryId });
                    table.ForeignKey(
                        name: "FK_ChallengeTechnologyCategories_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChallengeTechnologyCategories_TechnologyCategories_Technolo~",
                        column: x => x.TechnologyCategoryId,
                        principalTable: "TechnologyCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SavedChallenges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StartupProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChallengeId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedChallenges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedChallenges_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedChallenges_StartupProfiles_StartupProfileId",
                        column: x => x.StartupProfileId,
                        principalTable: "StartupProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_DepartmentId",
                table: "Users",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Challenges_ChallengeReferenceNumber",
                table: "Challenges",
                column: "ChallengeReferenceNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeApplications_ChallengeId",
                table: "ChallengeApplications",
                column: "ChallengeId");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeApplications_StartupProfileId",
                table: "ChallengeApplications",
                column: "StartupProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeTechnologyCategories_TechnologyCategoryId",
                table: "ChallengeTechnologyCategories",
                column: "TechnologyCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedChallenges_ChallengeId",
                table: "SavedChallenges",
                column: "ChallengeId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedChallenges_StartupProfileId_ChallengeId",
                table: "SavedChallenges",
                columns: new[] { "StartupProfileId", "ChallengeId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Departments_DepartmentId",
                table: "Users",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Departments_DepartmentId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "ChallengeApplications");

            migrationBuilder.DropTable(
                name: "ChallengeTechnologyCategories");

            migrationBuilder.DropTable(
                name: "SavedChallenges");

            migrationBuilder.DropIndex(
                name: "IX_Users_DepartmentId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Challenges_ChallengeReferenceNumber",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BackgroundEnglish",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "BackgroundMarathi",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "ChallengeReferenceNumber",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "ClosedAt",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "CurrentSituation",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "DesiredOutcomeEnglish",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "DesiredOutcomeMarathi",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "EstimatedBudget",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "FunctionalRequirements",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "FundingType",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "PilotRequirement",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "PublishedAt",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "SubmissionClosingDate",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Challenges");

            migrationBuilder.RenameColumn(
                name: "TitleMarathi",
                table: "Challenges",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "TitleEnglish",
                table: "Challenges",
                newName: "Timeline");

            migrationBuilder.RenameColumn(
                name: "TargetBeneficiaries",
                table: "Challenges",
                newName: "ProblemStatement");

            migrationBuilder.RenameColumn(
                name: "SubmissionOpeningDate",
                table: "Challenges",
                newName: "SubmissionDeadline");

            migrationBuilder.RenameColumn(
                name: "Sector",
                table: "Challenges",
                newName: "PilotExpectations");

            migrationBuilder.RenameColumn(
                name: "ProcurementExpectation",
                table: "Challenges",
                newName: "IpRequirements");

            migrationBuilder.RenameColumn(
                name: "ProblemStatementMarathi",
                table: "Challenges",
                newName: "EvaluationCriteria");

            migrationBuilder.RenameColumn(
                name: "ProblemStatementEnglish",
                table: "Challenges",
                newName: "DesiredOutcome");

            migrationBuilder.RenameColumn(
                name: "PilotDuration",
                table: "Challenges",
                newName: "ChallengeId");

            migrationBuilder.RenameColumn(
                name: "IntellectualPropertyRequirements",
                table: "Challenges",
                newName: "BudgetFundingInformation");

            migrationBuilder.RenameColumn(
                name: "GeographicScope",
                table: "Challenges",
                newName: "Background");

            migrationBuilder.AddColumn<Guid>(
                name: "HeadUserId",
                table: "Departments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_HeadUserId",
                table: "Departments",
                column: "HeadUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Challenges_ChallengeId",
                table: "Challenges",
                column: "ChallengeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Users_HeadUserId",
                table: "Departments",
                column: "HeadUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
