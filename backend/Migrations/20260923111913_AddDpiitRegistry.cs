using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GovPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDpiitRegistry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DpiitRegistries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DpiitNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PanNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    IsValidRegistration = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DpiitRegistries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DpiitRegistries_DpiitNumber_PanNumber",
                table: "DpiitRegistries",
                columns: new[] { "DpiitNumber", "PanNumber" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DpiitRegistries");
        }
    }
}
