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
    public class PetitionsController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public PetitionsController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/Petitions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Petition>>> GetPetition(
            string employee = null, 
            string workplace = null, 
            bool ismanager = true,
            string house = null
            )
        {
            if (workplace != null || house != null)
            {
                if (ismanager)
                {
                    var workplaceGuid = new Guid(workplace);
                    return await _context.Petition.Where(x => x.EmployeeNavigation.HouseNavigation.Workplace == workplaceGuid).OrderByDescending(x => x.Date).ToListAsync();
                }
                else
                {
                    var houseGuid = new Guid(house);
                    if (house != null) return await _context.Petition.Where(x => x.EmployeeNavigation.House == houseGuid && (x.Type == "Вопрос" || x.Type == "Помощь")).OrderByDescending(x => x.Date).ToListAsync();
                }
            }
            if (employee != null)
            {
                var employeeGuid = new Guid(employee);
                return await _context.Petition.Where(x=>x.Employee == employeeGuid).OrderByDescending(x => x.Date).Include(x => x.AnswerPetition).ToListAsync();
            }
            return null;
        }

        // GET: api/Petitions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Petition>> GetPetition(Guid id)
        {
            var petition = await _context.Petition.Include(x=>x.AnswerPetition).FirstOrDefaultAsync(i => i.Id == id);

            if (petition == null)
            {
                return NotFound();
            }

            return petition;
        }

        // PUT: api/Petitions/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPetition(Guid id, Petition petition)
        {
            petition.Id = id;
            if (id != petition.Id)
            {
                return BadRequest();
            }

            _context.Entry(petition).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PetitionExists(id))
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

        // POST: api/Petitions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Petition>> PostPetition(Petition petition)
        {
            _context.Petition.Add(petition);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PetitionExists(petition.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPetition", new { id = petition.Id }, petition);
        }

        // DELETE: api/Petitions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Petition>> DeletePetition(Guid id)
        {
            var petition = await _context.Petition.FindAsync(id);
            if (petition == null)
            {
                return NotFound();
            }

            _context.Petition.Remove(petition);
            await _context.SaveChangesAsync();

            return petition;
        }

        private bool PetitionExists(Guid id)
        {
            return _context.Petition.Any(e => e.Id == id);
        }
    }
}
