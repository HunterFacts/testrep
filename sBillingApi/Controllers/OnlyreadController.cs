using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sBillingApi.Helpers;
using sBillingApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sBillingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OnlyreadController : ControllerBase
    {
        const int procent = 100;

        private readonly TaranScrmContext _context;

        public OnlyreadController(TaranScrmContext context)
        {
            _context = context;
        }

        [HttpGet("raiting")]
        public async Task<ActionResult<ICollection<RaitingEmployee>>> GetRaiting(string house)
        {
            var range = new ConclusionRange();
;
            var houseGuid = new Guid(house);

            var workshiftsEmployee = await _context.Workshift.Where(x => x.Date >= range.monday && x.Date < range.sunday.AddDays(1) && x.House == houseGuid).OrderBy(x => x.Date).Select(x => x.EmployeeOnWorkshift).ToListAsync();

            List<RaitingEmployee> employeeSum = new List<RaitingEmployee>();

            foreach (ICollection<EmployeeOnWorkshift> workshiftsEmployeeList in workshiftsEmployee)
            {
                foreach (EmployeeOnWorkshift employeeOnWorkshift in workshiftsEmployeeList.ToList())
                {
                    RaitingEmployee employeeOnWorkshiftSum = null;
                    if (employeeSum.Count != 0)
                    {
                        employeeOnWorkshiftSum = employeeSum.Find(x => x.employee.Id == employeeOnWorkshift.Employee);
                    }

                    if (employeeOnWorkshiftSum == null)
                    {
                        var employee = await _context.Employee.FindAsync(employeeOnWorkshift.Employee);
                        var raitingEmployeeNew = new RaitingEmployee()
                        {
                            employee = employee,
                            token = employeeOnWorkshift.Token
                        };
                        employeeSum.Add(raitingEmployeeNew);
                    }
                    else
                    {
                        employeeOnWorkshiftSum.token = employeeOnWorkshiftSum.token + employeeOnWorkshift.Token;
                    }
                }
            }

            foreach (RaitingEmployee raitingEmployee in employeeSum)
            {
                raitingEmployee.token = Math.Floor(((double)raitingEmployee.token / 100) * raitingEmployee.employee.Procent.Value);
                raitingEmployee.fio = raitingEmployee.employee.Fio;
                raitingEmployee.employee = null;
            }

            employeeSum.OrderByDescending(x => x.token);

            return employeeSum.ToArray();
        }

        [HttpGet("raitingmonth")]
        public async Task<ActionResult<ICollection<RaitingEmployee>>> GetRaitingMonth(string house)
        {
            var range = new ConclusionRange();

            DateTime date = DateTime.Today;

            var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            range.monday = firstDayOfMonth;
            range.sunday = lastDayOfMonth;

            var houseGuid = new Guid(house);

            var workshiftsEmployee = await _context.Workshift.Where(x => x.Date >= range.monday && x.Date < range.sunday.AddDays(1) && x.House == houseGuid).OrderBy(x => x.Date).Select(x => x.EmployeeOnWorkshift).ToListAsync();

            List<RaitingEmployee> employeeSum = new List<RaitingEmployee>();

            foreach (ICollection<EmployeeOnWorkshift> workshiftsEmployeeList in workshiftsEmployee)
            {
                foreach (EmployeeOnWorkshift employeeOnWorkshift in workshiftsEmployeeList.ToList())
                {
                    RaitingEmployee employeeOnWorkshiftSum = null;
                    if (employeeSum.Count != 0)
                    {
                        employeeOnWorkshiftSum = employeeSum.Find(x => x.employee.Id == employeeOnWorkshift.Employee);
                    }

                    if (employeeOnWorkshiftSum == null)
                    {
                        var employee = await _context.Employee.FindAsync(employeeOnWorkshift.Employee);
                        var raitingEmployeeNew = new RaitingEmployee()
                        {
                            employee = employee,
                            token = employeeOnWorkshift.Token
                        };
                        employeeSum.Add(raitingEmployeeNew);
                    }
                    else
                    {
                        employeeOnWorkshiftSum.token = employeeOnWorkshiftSum.token + employeeOnWorkshift.Token;
                    }
                }
            }

            foreach (RaitingEmployee raitingEmployee in employeeSum)
            {
                raitingEmployee.token = Math.Floor(((double)raitingEmployee.token / 100) * raitingEmployee.employee.Procent.Value);
                raitingEmployee.fio = raitingEmployee.employee.Fio;
                raitingEmployee.employee = null;
            }

            employeeSum.OrderByDescending(x => x.token);

            return employeeSum.ToArray();
        }

        [HttpGet("modeldata")]
        public async Task<ActionResult<ModelData>> GetModelData(string employee)
        {
            ModelData modelData = new ModelData();

            var employeeGuid = new Guid(employee);
            var range = new ConclusionRange();
            var workshiftsEmployeeWeekly = await _context.Workshift.Where(x => x.Date >= range.monday && x.Date < range.sunday.AddDays(1) && x.Timeend != null).OrderBy(x => x.Date).Select(x => x.EmployeeOnWorkshift.Where(x=>x.Employee == employeeGuid)).ToListAsync();

            foreach (ICollection<EmployeeOnWorkshift> workshiftEmployeeCollection in workshiftsEmployeeWeekly)
            {
                foreach (EmployeeOnWorkshift employeeOnWorkshift in workshiftEmployeeCollection)
                {
                    modelData.tokenWeekly = (double)(modelData.tokenWeekly + employeeOnWorkshift.Token);
                }
            }

            DateTime date = DateTime.Today;

            var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var workshiftsEmployeeMonth = await _context.Workshift.Where(x => x.Date >= firstDayOfMonth && x.Date < lastDayOfMonth && x.Timeend != null).OrderBy(x => x.Date).Select(x => x.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid)).ToListAsync();

            foreach (ICollection<EmployeeOnWorkshift> workshiftEmployeeCollection in workshiftsEmployeeMonth)
            {
                foreach (EmployeeOnWorkshift employeeOnWorkshift in workshiftEmployeeCollection)
                {
                    modelData.tokenMonth = (double)(modelData.tokenMonth + employeeOnWorkshift.Token);
                }
            }

            var employeeObject = await _context.Employee.FindAsync(employeeGuid);

            modelData.tokenWeekly = Math.Floor(((double)modelData.tokenWeekly / 100) * employeeObject.Procent.Value);
            modelData.tokenMonth = Math.Floor(((double)modelData.tokenMonth / 100) * employeeObject.Procent.Value);

            modelData.workshiftsCount = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= range.monday && x.WorkshiftNavigation.Date < range.sunday.AddDays(1)).CountAsync();
            double halfWorkshiftsWeeklyCount = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= range.monday && x.WorkshiftNavigation.Date < range.sunday.AddDays(1) && x.WorkshiftNavigation.Isfull == false).CountAsync();

            modelData.workshiftsCount -= (halfWorkshiftsWeeklyCount / 2);

            List<double?> doubles = await _context.Loan.Where(x => x.Employee == employeeGuid).Select(x => x.Amount).ToListAsync();
            modelData.loan = doubles.Sum();
            var loanCount = await _context.Loan.Where(x => x.Employee == employeeGuid).CountAsync();
            modelData.isLoan = loanCount > 0;

            modelData.penaltyOnShifts = await _context.PenaltyOnShift.Where(x => x.WorkshiftNavigation.Date >= range.monday && x.WorkshiftNavigation.Date < range.sunday.AddDays(1) && x.WorkshiftNavigation.Timeend != null && x.Employee == employeeGuid).ToListAsync();

            

            modelData.workshiftNormally = employeeObject.Studying ? 4 : 6;

            return modelData;
        }

        [HttpPost("loan")]
        public async Task<ActionResult> SaveLoan(double amount, string message, string employee)
        {
            var employeeGuid = new Guid(employee);

            Loan loan = new Loan()
            {
                Id = new Guid(),
                Amount = amount,
                Reason = message,
                Date = DateTime.Now,
                Employee = employeeGuid
            };

            await _context.Loan.AddAsync(loan);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("loans")]
        public async Task<ActionResult<ICollection<Loan>>> GetLoans(string employee)
        {
            var employeeGuid = new Guid(employee);
            return await _context.Loan.Where(x => x.Employee == employeeGuid).ToListAsync();
        }

        [HttpGet("petitions")]
        public async Task<ActionResult<ICollection<Petition>>> GetPetition(string employee)
        {
            var employeeGuid = new Guid(employee);
            return await _context.Petition.Where(x=>x.Employee == employeeGuid).ToListAsync();
        }

        [HttpGet("getModelTransactions")]
        public async Task<ActionResult<ICollection<ModelTransaction>>> GetModelTransactions(string employee)
        {
            var employeeGuid = new Guid(employee);

            var employeeOnWorkshifts = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.Token > 0 && x.WorkshiftNavigation.Timeend != null).ToListAsync();

            List<ModelTransaction> modelTransactions = new List<ModelTransaction>();

            foreach (var employeeOnWorkshift in employeeOnWorkshifts)
            {
                var transaction = new ModelTransaction();
                transaction.employeeOnWorkshift = employeeOnWorkshift;

                var workshift = await _context.Workshift.Where(x => x.Id == employeeOnWorkshift.Workshift).FirstOrDefaultAsync();

                transaction.workshift = workshift;

                modelTransactions.Add(transaction);
            }

            return modelTransactions;
        }
    }

    public class ModelTransaction
    {
        public EmployeeOnWorkshift employeeOnWorkshift;
        public Workshift workshift;
    }

    public class ModelData {
        public double tokenWeekly = 0;
        public double tokenMonth = 0;
        public double rub;
        public double workshiftsCount;
        public double? loan;
        public List<PenaltyOnShift> penaltyOnShifts;
        public int workshiftNormally = 6;
        public bool isLoan = false;
    }

    public class RaitingEmployee
    {
        public Employee employee;
        public string fio;
        public double? token;
    }

}
