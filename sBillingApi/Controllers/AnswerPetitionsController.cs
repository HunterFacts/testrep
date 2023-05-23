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
    public class AnswerPetitionsController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public AnswerPetitionsController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/AnswerPetitions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnswerPetition>>> GetAnswerPetition()
        {
            return await _context.AnswerPetition.ToListAsync();
        }

        // GET: api/AnswerPetitions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AnswerPetition>> GetAnswerPetition(Guid id)
        {
            var answerPetition = await _context.AnswerPetition.FindAsync(id);

            if (answerPetition == null)
            {
                return NotFound();
            }

            return answerPetition;
        }

        // PUT: api/AnswerPetitions/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnswerPetition(Guid id, AnswerPetition answerPetition)
        {
            if (id != answerPetition.Id)
            {
                return BadRequest();
            }

            _context.Entry(answerPetition).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnswerPetitionExists(id))
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

        // POST: api/AnswerPetitions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<AnswerPetition>> PostAnswerPetition(AnswerPetition answerPetition)
        {
            _context.AnswerPetition.Add(answerPetition);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AnswerPetitionExists(answerPetition.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetAnswerPetition", new { id = answerPetition.Id }, answerPetition);
        }

        // DELETE: api/AnswerPetitions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<AnswerPetition>> DeleteAnswerPetition(Guid id)
        {
            var answerPetition = await _context.AnswerPetition.FindAsync(id);
            if (answerPetition == null)
            {
                return NotFound();
            }

            _context.AnswerPetition.Remove(answerPetition);
            await _context.SaveChangesAsync();

            return answerPetition;
        }

        private bool AnswerPetitionExists(Guid id)
        {
            return _context.AnswerPetition.Any(e => e.Id == id);
        }
    }
}
