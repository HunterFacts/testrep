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
    public class ReferralsController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public ReferralsController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/Referrals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Referral>>> GetReferral(
            string employee = null)
        {
            if (employee != null)
            {
                Guid employeeGuid = new Guid(employee);
                return await _context.Referral.Where(
                x => x.Receive == employeeGuid)
                .ToListAsync();
            }
            return null;
        }

        // GET: api/Referrals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Referral>> GetReferral(Guid id)
        {
            var referral = await _context.Referral.FindAsync(id);

            if (referral == null)
            {
                return NotFound();
            }

            return referral;
        }

        // PUT: api/Referrals/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReferral(Guid id, Referral referral)
        {
            referral.Id = id;
            if (id != referral.Id)
            {
                return BadRequest();
            }

            _context.Entry(referral).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReferralExists(id))
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

        // POST: api/Referrals
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Referral>> PostReferral(Referral referral)
        {
            _context.Referral.Add(referral);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ReferralExists(referral.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetReferral", new { id = referral.Id }, referral);
        }

        // DELETE: api/Referrals/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Referral>> DeleteReferral(Guid id)
        {
            var referral = await _context.Referral.FindAsync(id);
            if (referral == null)
            {
                return NotFound();
            }

            _context.Referral.Remove(referral);
            await _context.SaveChangesAsync();

            return referral;
        }

        private bool ReferralExists(Guid id)
        {
            return _context.Referral.Any(e => e.Id == id);
        }
    }
}
