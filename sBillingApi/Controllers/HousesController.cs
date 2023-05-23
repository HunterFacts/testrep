using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using sBillingApi;
using sBillingApi.Models;

namespace sBillingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HousesController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public HousesController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/Houses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<House>>> GetHouse(string workplace = null)
        {
            var houses = _context.House;
            if (workplace != null)
            {
                return await houses.Where(x => x.Workplace == new Guid(workplace)).ToListAsync();
            }
            return await houses.ToListAsync();
        }

        // GET: api/Houses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<House>> GetHouse(Guid id, string include = null)
        {
            House house = null;
            if (include == "room")
            {
                house = await _context.House.Include(x => x.Room).FirstOrDefaultAsync(x => x.Id == id);
            }
            else if (include == "room_workshifttype")
            {
                house = await _context.House.Include(x => x.Room).Include(x=>x.WorkshiftType).FirstOrDefaultAsync(x => x.Id == id);
            }
            else
            {
                house = await _context.House.FirstOrDefaultAsync(x => x.Id == id);
            }
            

            if (house == null)
            {
                return NotFound();
            }

            return house;
        }

        // PUT: api/Houses/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHouse(Guid id, House house)
        {
            house.Id = id;
            if (id != house.Id)
            {
                return BadRequest();
            }

            _context.Entry(house).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HouseExists(id))
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

        // POST: api/Houses
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<House>> PostHouse(House house)
        {
            _context.House.Add(house);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (HouseExists(house.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetHouse", new { id = house.Id }, house);
        }

        // DELETE: api/Houses/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<House>> DeleteHouse(Guid id)
        {
            var house = await _context.House.FindAsync(id);
            if (house == null)
            {
                return NotFound();
            }

            _context.House.Remove(house);
            await _context.SaveChangesAsync();

            return house;
        }

        private bool HouseExists(Guid id)
        {
            return _context.House.Any(e => e.Id == id);
        }
    }
}
