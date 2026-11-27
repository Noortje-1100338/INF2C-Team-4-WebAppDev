using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hollowmere.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddLoanConditionNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConditionNote",
                table: "Loans",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConditionNote",
                table: "Loans");
        }
    }
}
