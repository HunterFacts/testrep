using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sBillingApi.Models;

namespace sBillingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkshiftTypesController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public WorkshiftTypesController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/WorkshiftTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkshiftType>>> GetWorkshiftType(string house)
        {
            if (house == null)
            {
                return NotFound();
            }
            var houseGuid = new Guid(house);
            return await _context.WorkshiftType.Where(x=>x.House == houseGuid).OrderByDescending(x=>x.Position).ToListAsync();
        }

        // GET: api/WorkshiftTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkshiftType>> GetWorkshiftType(Guid id)
        {
            var workshiftType = await _context.WorkshiftType.FindAsync(id);

            if (workshiftType == null)
            {
                return NotFound();
            }

            return workshiftType;
        }

        // PUT: api/WorkshiftTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkshiftType(Guid id, WorkshiftType workshiftType)
        {
            workshiftType.Id = id;

            _context.Entry(workshiftType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkshiftTypeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/WorkshiftTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<WorkshiftType>> PostWorkshiftType(WorkshiftType workshiftType)
        {
            _context.WorkshiftType.Add(workshiftType);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (WorkshiftTypeExists(workshiftType.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetWorkshiftType", new { id = workshiftType.Id }, workshiftType);
        }

        // DELETE: api/WorkshiftTypes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<WorkshiftType>> DeleteWorkshiftType(Guid id)
        {
            var workshiftType = await _context.WorkshiftType.FindAsync(id);
            if (workshiftType == null)
            {
                return NotFound();
            }

            _context.WorkshiftType.Remove(workshiftType);
            await _context.SaveChangesAsync();

            return workshiftType;
        }

        private bool WorkshiftTypeExists(Guid id)
        {
            return _context.WorkshiftType.Any(e => e.Id == id);
        }
    }
}
