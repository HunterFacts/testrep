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
    public class PenaltyOnShiftsController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public PenaltyOnShiftsController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/PenaltyOnShifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PenaltyOnShift>>> GetPenaltyOnShift(
            string employee = null,
            string workshift = null
            )
        {
            if (workshift != null)
            {
                if (employee != null)
                {
                    var employeeGuid = new Guid(employee);
                    var workshiftGuid = new Guid(workshift);
                    return await _context.PenaltyOnShift.Where(x => x.Workshift == workshiftGuid && x.Employee == employeeGuid).ToListAsync();
                }
                else
                {
                    var workshiftGuid = new Guid(workshift);
                    return await _context.PenaltyOnShift.Where(x => x.Workshift == workshiftGuid).ToListAsync();
                }
            }
            
            return null;
        }

        // GET: api/PenaltyOnShifts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PenaltyOnShift>> GetPenaltyOnShift(Guid id)
        {
            var penaltyOnShift = await _context.PenaltyOnShift.FindAsync(id);

            if (penaltyOnShift == null)
            {
                return NotFound();
            }

            return penaltyOnShift;
        }

        // PUT: api/PenaltyOnShifts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPenaltyOnShift(Guid id, PenaltyOnShift penaltyOnShift)
        {
            penaltyOnShift.Id = id;
            if (id != penaltyOnShift.Id)
            {
                return BadRequest();
            }

            _context.Entry(penaltyOnShift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PenaltyOnShiftExists(id))
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

        // POST: api/PenaltyOnShifts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<PenaltyOnShift>> PostPenaltyOnShift(PenaltyOnShift penaltyOnShift)
        {
            _context.PenaltyOnShift.Add(penaltyOnShift);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PenaltyOnShiftExists(penaltyOnShift.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPenaltyOnShift", new { id = penaltyOnShift.Id }, penaltyOnShift);
        }

        // DELETE: api/PenaltyOnShifts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PenaltyOnShift>> DeletePenaltyOnShift(Guid id)
        {
            var penaltyOnShift = await _context.PenaltyOnShift.FindAsync(id);
            if (penaltyOnShift == null)
            {
                return NotFound();
            }

            _context.PenaltyOnShift.Remove(penaltyOnShift);
            await _context.SaveChangesAsync();

            return penaltyOnShift;
        }

        private bool PenaltyOnShiftExists(Guid id)
        {
            return _context.PenaltyOnShift.Any(e => e.Id == id);
        }
    }
}
