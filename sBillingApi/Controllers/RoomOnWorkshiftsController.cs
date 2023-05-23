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
    public class RoomOnWorkshiftsController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public RoomOnWorkshiftsController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/RoomOnWorkshifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomOnWorkshift>>> GetRoomOnWorkshift(string workshift = null)
        {
            if (workshift != null)
            {
                var workshiftGuid = new Guid(workshift);
                return await _context.RoomOnWorkshift.Where(x=>x.Workshift == workshiftGuid).ToListAsync();
            }
            return await _context.RoomOnWorkshift.ToListAsync();
        }

        // GET: api/RoomOnWorkshifts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomOnWorkshift>> GetRoomOnWorkshift(Guid id)
        {
            var roomOnWorkshift = await _context.RoomOnWorkshift.FindAsync(id);

            if (roomOnWorkshift == null)
            {
                return NotFound();
            }

            return roomOnWorkshift;
        }

        // PUT: api/RoomOnWorkshifts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoomOnWorkshift(Guid id, RoomOnWorkshift roomOnWorkshift)
        {
            roomOnWorkshift.Id = id;
            if (id != roomOnWorkshift.Id)
            {
                return BadRequest();
            }

            _context.Entry(roomOnWorkshift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomOnWorkshiftExists(id))
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

        // POST: api/RoomOnWorkshifts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<RoomOnWorkshift>> PostRoomOnWorkshift(RoomOnWorkshift roomOnWorkshift)
        {
            _context.RoomOnWorkshift.Add(roomOnWorkshift);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RoomOnWorkshiftExists(roomOnWorkshift.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRoomOnWorkshift", new { id = roomOnWorkshift.Id }, roomOnWorkshift);
        }

        // DELETE: api/RoomOnWorkshifts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<RoomOnWorkshift>> DeleteRoomOnWorkshift(Guid id)
        {
            var roomOnWorkshift = await _context.RoomOnWorkshift.FindAsync(id);
            if (roomOnWorkshift == null)
            {
                return NotFound();
            }

            _context.RoomOnWorkshift.Remove(roomOnWorkshift);
            await _context.SaveChangesAsync();

            return roomOnWorkshift;
        }

        private bool RoomOnWorkshiftExists(Guid id)
        {
            return _context.RoomOnWorkshift.Any(e => e.Id == id);
        }
    }
}
