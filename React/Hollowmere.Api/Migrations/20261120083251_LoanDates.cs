using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hollowmere.Api.Migrations
{
    /// <inheritdoc />
    public partial class LoanDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReturnDate",
                table: "Loans",
                newName: "DueDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReturnedAt",
                table: "Loans",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReturnedAt",
                table: "Loans");

            migrationBuilder.RenameColumn(
                name: "DueDate",
                table: "Loans",
                newName: "ReturnDate");
        }
    }
}
