using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GovPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class AddVerificationStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VerificationStatus",
                table: "StartupProfiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AIVerificationReports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StartupProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    RawJsonAnalysis = table.Column<string>(type: "text", nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    IsRecommended = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIVerificationReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AIVerificationReports_StartupProfiles_StartupProfileId",
                        column: x => x.StartupProfileId,
                        principalTable: "StartupProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PurchaseOrders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderNumber = table.Column<string>(type: "text", nullable: false),
                    StartupProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    DepartmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    SandboxTrialId = table.Column<Guid>(type: "uuid", nullable: true),
                    ProductName = table.Column<string>(type: "text", nullable: false),
                    ItemDescription = table.Column<string>(type: "text", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    GstAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    Rule149ExemptionRef = table.Column<string>(type: "text", nullable: false),
                    DeliveryConsigneeAddress = table.Column<string>(type: "text", nullable: false),
                    ProcurementOfficerName = table.Column<string>(type: "text", nullable: false),
                    EscrowStatus = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MilestoneNotes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PurchaseOrders_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PurchaseOrders_SandboxTrials_SandboxTrialId",
                        column: x => x.SandboxTrialId,
                        principalTable: "SandboxTrials",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PurchaseOrders_StartupProfiles_StartupProfileId",
                        column: x => x.StartupProfileId,
                        principalTable: "StartupProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AIVerificationReports_StartupProfileId",
                table: "AIVerificationReports",
                column: "StartupProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_DepartmentId",
                table: "PurchaseOrders",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_OrderNumber",
                table: "PurchaseOrders",
                column: "OrderNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_SandboxTrialId",
                table: "PurchaseOrders",
                column: "SandboxTrialId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_StartupProfileId",
                table: "PurchaseOrders",
                column: "StartupProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AIVerificationReports");

            migrationBuilder.DropTable(
                name: "PurchaseOrders");

            migrationBuilder.DropColumn(
                name: "VerificationStatus",
                table: "StartupProfiles");
        }
    }
}
