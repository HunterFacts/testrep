using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sBillingApi.Helpers;
using sBillingApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.Text.Json;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace sBillingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public ScheduleController(TaranScrmContext context)
        {
            _context = context;
        }

        [HttpGet("schedule")]
        public async Task<ActionResult<IEnumerable<Workshift>>> Schedule(string house, DateTime date)
        {
            try
            {
                var houseGuid = new Guid(house);

                var workshifts = await _context.Workshift.Where(x => x.Date >= date.AddDays(-7) && x.Date < date.AddDays(8) && x.House == houseGuid).OrderBy(x => x.Date)
                    .Include(x => x.RoomOnWorkshift)
                    .ThenInclude(x => x.EmployeeOnWorkshift)
                    .ToListAsync();

                return workshifts;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("schedule/rooms")]
        public async Task<ActionResult<IEnumerable<Room>>> ScheduleRooms(string house)
        {
            try
            {
                var houseGuid = new Guid(house);
                var rooms = await _context.Room.Where(x=>x.House == houseGuid).OrderBy(x => x.NumberRoom)
                    .Include(x => x.RoomOnWorkshift)
                    .ThenInclude(x => x.EmployeeOnWorkshift)
                    .ToListAsync();

                return rooms;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("schedule/employee")]
        public async Task<ActionResult<IEnumerable<Employee>>> Employees(string house)
        {
            try
            {
                var houseGuid = new Guid(house);
                var employees = await _context.Employee.Where(x => x.House == houseGuid)
                    .ToListAsync();

                return employees;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("schedule/workshifttypes")]
        public async Task<ActionResult<IEnumerable<WorkshiftType>>> WorkshiftType(string house)
        {
            try
            {
                var houseGuid = new Guid(house);
                var workshifttypes = await _context.WorkshiftType.Where(x => x.House == houseGuid)
                    .ToListAsync();

                return workshifttypes;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
