using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GovPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSandboxTrialsWorkflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SandboxTrials",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TrialReferenceNumber = table.Column<string>(type: "text", nullable: false),
                    DepartmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartupProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChallengeId = table.Column<Guid>(type: "uuid", nullable: true),
                    ChallengeApplicationId = table.Column<Guid>(type: "uuid", nullable: true),
                    ValidatorUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: false),
                    TestingEnvironment = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Objective = table.Column<string>(type: "text", nullable: false),
                    DurationDays = table.Column<int>(type: "integer", nullable: false),
                    MaximumBudget = table.Column<decimal>(type: "numeric", nullable: false),
                    ExpectedOutcomes = table.Column<string>(type: "text", nullable: false),
                    RiskMitigationPlan = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SandboxTrials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SandboxTrials_ChallengeApplications_ChallengeApplicationId",
                        column: x => x.ChallengeApplicationId,
                        principalTable: "ChallengeApplications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SandboxTrials_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SandboxTrials_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SandboxTrials_StartupProfiles_StartupProfileId",
                        column: x => x.StartupProfileId,
                        principalTable: "StartupProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SandboxTrials_Users_ValidatorUserId",
                        column: x => x.ValidatorUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SandboxTrialKPIs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SandboxTrialId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Unit = table.Column<string>(type: "text", nullable: false),
                    BaselineValue = table.Column<decimal>(type: "numeric", nullable: false),
                    TargetValue = table.Column<decimal>(type: "numeric", nullable: false),
                    LatestValue = table.Column<decimal>(type: "numeric", nullable: false),
                    AchievementPercentage = table.Column<decimal>(type: "numeric", nullable: false),
                    MeasurementMethod = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SandboxTrialKPIs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SandboxTrialKPIs_SandboxTrials_SandboxTrialId",
                        column: x => x.SandboxTrialId,
                        principalTable: "SandboxTrials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrialDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SandboxTrialId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    DocumentType = table.Column<string>(type: "text", nullable: false),
                    FileUrl = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrialDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrialDocuments_SandboxTrials_SandboxTrialId",
                        column: x => x.SandboxTrialId,
                        principalTable: "SandboxTrials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrialMilestones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SandboxTrialId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric", nullable: false),
                    AllocatedAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    EvidenceSummary = table.Column<string>(type: "text", nullable: false),
                    Remarks = table.Column<string>(type: "text", nullable: false),
                    ApprovedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrialMilestones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrialMilestones_SandboxTrials_SandboxTrialId",
                        column: x => x.SandboxTrialId,
                        principalTable: "SandboxTrials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrialStatusHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SandboxTrialId = table.Column<Guid>(type: "uuid", nullable: false),
                    PreviousStatus = table.Column<string>(type: "text", nullable: false),
                    NewStatus = table.Column<string>(type: "text", nullable: false),
                    ChangedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChangedByName = table.Column<string>(type: "text", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrialStatusHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrialStatusHistories_SandboxTrials_SandboxTrialId",
                        column: x => x.SandboxTrialId,
                        principalTable: "SandboxTrials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KPIMeasurements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SandboxTrialKPIId = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<decimal>(type: "numeric", nullable: false),
                    MeasuredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MeasuredByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MeasuredByName = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    EvidenceDocumentUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KPIMeasurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KPIMeasurements_SandboxTrialKPIs_SandboxTrialKPIId",
                        column: x => x.SandboxTrialKPIId,
                        principalTable: "SandboxTrialKPIs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KPIMeasurements_SandboxTrialKPIId",
                table: "KPIMeasurements",
                column: "SandboxTrialKPIId");

            migrationBuilder.CreateIndex(
                name: "IX_SandboxTrialKPIs_SandboxTrialId",
                table: "SandboxTrialKPIs",
                column: "SandboxTrialId");

            migrationBuilder.CreateIndex(
                name: "IX_SandboxTrials_ChallengeApplicationId",
                table: "SandboxTrials",
                column: "ChallengeApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_SandboxTrials_ChallengeId",
                table: "SandboxTrials",
                column: "ChallengeId");

            migrationBuilder.CreateIndex(
                name: "IX_SandboxTrials_DepartmentId",
                table: "SandboxTrials",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_SandboxTrials_StartupProfileId",
                table: "SandboxTrials",
                column: "StartupProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_SandboxTrials_Status",
                table: "SandboxTrials",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_SandboxTrials_TrialReferenceNumber",
                table: "SandboxTrials",
                column: "TrialReferenceNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SandboxTrials_ValidatorUserId",
                table: "SandboxTrials",
                column: "ValidatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrialDocuments_SandboxTrialId",
                table: "TrialDocuments",
                column: "SandboxTrialId");

            migrationBuilder.CreateIndex(
                name: "IX_TrialMilestones_SandboxTrialId",
                table: "TrialMilestones",
                column: "SandboxTrialId");

            migrationBuilder.CreateIndex(
                name: "IX_TrialStatusHistories_SandboxTrialId",
                table: "TrialStatusHistories",
                column: "SandboxTrialId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KPIMeasurements");

            migrationBuilder.DropTable(
                name: "TrialDocuments");

            migrationBuilder.DropTable(
                name: "TrialMilestones");

            migrationBuilder.DropTable(
                name: "TrialStatusHistories");

            migrationBuilder.DropTable(
                name: "SandboxTrialKPIs");

            migrationBuilder.DropTable(
                name: "SandboxTrials");
        }
    }
}
