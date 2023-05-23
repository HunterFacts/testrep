using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public AnalyticsController(TaranScrmContext context)
        {
            _context = context;
        }

        [HttpGet("incomeByRange")]
        public async Task<ActionResult<ICollection<IncomeByRangeItem>>> GetIncomeByRange(string DateStart, string DateEnd, string workplace)
        {
            List<IncomeByRangeItem> incomeByRangeItems = new List<IncomeByRangeItem>();
            var dateStart = DateTime.Parse(DateStart);
            var dateEnd = DateTime.Parse(DateEnd);
            var workplaceGuid = new Guid(workplace);
            var dateStep = dateStart;
            var workshifts = await _context.Workshift.Where(x => x.Date >= dateStart && x.Date <= dateEnd.AddDays(1) && x.HouseNavigation.Workplace == workplaceGuid && x.Timeend != null).ToListAsync();
            do
            {
                try
                {
                    IncomeByRangeItem incomeByRangeItem = new IncomeByRangeItem();

                    var workshiftList = workshifts.Where(x => x.Date.Value.Date == dateStep.Date).ToList();

                    incomeByRangeItem.date = dateStep;

                    foreach (var workshift in workshiftList)
                    {
                        incomeByRangeItem.tokens = (double)(incomeByRangeItem.tokens + workshift.Token);
                    }
                    incomeByRangeItem.Workshifts = workshiftList;

                    incomeByRangeItems.Add(incomeByRangeItem);
                    dateStep = dateStep.AddDays(1);
                }
                catch (Exception ex)
                {
                    throw new Exception();
                }
            }
            while (dateStep < dateEnd);

            return incomeByRangeItems.ToArray();
        }

        [HttpGet("incomeByRangeYear")]
        public async Task<ActionResult<ICollection<IncomeByRangeYear>>> GetIncomeByRangeYear(string workplace)
        {
            List<IncomeByRangeYear> incomeByRangeYear = new List<IncomeByRangeYear>();

            int year = DateTime.Now.Year;
            DateTime stepMonth = new DateTime(year, 1, 1);
            DateTime lastMonth = new DateTime(year, 12, 31);
            var workplaceGuid = new Guid(workplace);
            do
            {
                try
                {
                    var incomeByRangeItems = new List<IncomeByRangeItem>();
                    var dateStart = new DateTime(year, stepMonth.Month, 1);
                    var dateEnd = new DateTime(year, stepMonth.Month, DateTime.DaysInMonth(year, stepMonth.Month));
                    var inc = new IncomeByRangeYear()
                    {
                        incomeByRangeItems = incomeByRangeItems,
                        date = dateStart,
                        tokens = 0
                    };
                    
                    var dateStep = dateStart;
                    var workshifts = await _context.Workshift.Where(x => x.Date >= dateStart && x.Date <= dateEnd.AddDays(1) && x.HouseNavigation.Workplace == workplaceGuid && x.Timeend != null).ToListAsync();
                    do
                    {
                        try
                        {
                            IncomeByRangeItem incomeByRangeItem = new IncomeByRangeItem();

                            var workshiftList = workshifts.Where(x => x.Date.Value.Date == dateStep.Date).ToList();

                            incomeByRangeItem.date = dateStep;

                            foreach (var workshift in workshiftList)
                            {
                                inc.tokens = (double)(inc.tokens + workshift.Token);
                            }

                            inc.incomeByRangeItems.Add(incomeByRangeItem);
                            dateStep = dateStep.AddDays(1);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception();
                        }
                    }
                    while (dateStep < dateEnd);

                    incomeByRangeYear.Add(inc);
                    stepMonth = stepMonth.AddMonths(1);
                }
                catch (Exception ex)
                {
                    throw new Exception();
                }
            }
            while (stepMonth < lastMonth);

            return incomeByRangeYear.ToArray();
        }

        [HttpGet("incomeByRangeHouses")]
        public async Task<ActionResult<ICollection<IncomeByRangeHouse>>> GetIncomeByRangeHouses(string DateStart, string DateEnd, string workplace)
        {
            var workplaceGuid = new Guid(workplace);
            var houses = await _context.House.Where(x=>x.Workplace == workplaceGuid).ToListAsync();
            var incomeByRangeHouses = new List<IncomeByRangeHouse>();
            foreach (House house in houses)
            {
                List<IncomeByRangeItem> incomeByRangeItems = new List<IncomeByRangeItem>();
                var dateStart = DateTime.Parse(DateStart);
                var dateEnd = DateTime.Parse(DateEnd);
                var dateStep = dateStart;
                var workshifts = await _context.Workshift.Where(x => x.Date >= dateStart && x.Date <= dateEnd.AddDays(1) && x.House == house.Id && x.Timeend != null).ToListAsync();
                do
                {
                    try
                    {
                        IncomeByRangeItem incomeByRangeItem = new IncomeByRangeItem();

                        var workshiftList = workshifts.Where(x => x.Date.Value.Date == dateStep.Date).ToList();

                        incomeByRangeItem.date = dateStep;

                        foreach (var workshift in workshiftList)
                        {
                            incomeByRangeItem.tokens = (double)(incomeByRangeItem.tokens + workshift.Token);
                        }
                        incomeByRangeItem.Workshifts = workshiftList;

                        incomeByRangeItems.Add(incomeByRangeItem);
                        dateStep = dateStep.AddDays(1);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception();
                    }
                }
                while (dateStep < dateEnd);
                incomeByRangeHouses.Add(new IncomeByRangeHouse()
                {
                   incomeByRangeItem = incomeByRangeItems,
                   house = house
                });
            }
            return incomeByRangeHouses.ToArray();
        }

        [HttpGet("IncomeByRangeEmployee")]
        public async Task<ActionResult<ICollection<EmployeeProduction>>> IncomeByRangeEmployee(string workplace)
        {
            var range = new ConclusionRange();

            var workplaceGuid = new Guid(workplace);

            var employees = await _context.Employee.Where(x => x.HouseNavigation.Workplace == workplaceGuid && x.UserNavigation.Role == "model" && x.Actuality == true).ToListAsync();

            List<EmployeeProduction> listModelData = new List<EmployeeProduction>();

            foreach (Employee employee in employees)
            {
                listModelData.Add((await GetModelDataTokens(employee.Id.ToString())).Value);
            }

            return listModelData;
        }

        [HttpGet("IncomeEmployee")]
        public async Task<ActionResult<EmployeeData>> IncomeEmployee(string employee)
        {
            EmployeeData employeeData = new EmployeeData();
            var employeeGuid = new Guid(employee);

            var employeeObject = await _context.Employee.Where(x=>x.Id == employeeGuid).FirstAsync();
            employeeData.employee = employeeObject;

            var houseObject = await _context.House.Where(x => x.Id == employeeObject.House).FirstAsync();
            employeeData.house = houseObject;

            var modelData = await GetModelData(employee);
            employeeData.modelData = modelData.Value;

            List<IncomeByRangeItemEmployee> incomeByRangeItems = new List<IncomeByRangeItemEmployee>();
            var range = new ConclusionRange();
            var dateStart = range.monday;
            var dateEnd = range.sunday.AddDays(1);
            var dateStep = dateStart;
            var workshifts = await _context.EmployeeOnWorkshift.Where(x => x.WorkshiftNavigation.Date >= dateStart && x.WorkshiftNavigation.Date < dateEnd && x.WorkshiftNavigation.Timeend != null && x.Employee == employeeGuid).Include(x=>x.WorkshiftNavigation).ToListAsync();
            do
            {
                try
                {
                    IncomeByRangeItemEmployee incomeByRangeItem = new IncomeByRangeItemEmployee();

                    var workshiftList = workshifts.Where(x => x.WorkshiftNavigation.Date.Value.Date == dateStep.Date).ToList();

                    incomeByRangeItem.date = dateStep;

                    foreach (var workshift in workshiftList)
                    {
                        incomeByRangeItem.tokens = (double)(incomeByRangeItem.tokens + workshift.Token);
                    }
                    incomeByRangeItems.Add(incomeByRangeItem);
                    dateStep = dateStep.AddDays(1);
                }
                catch (Exception ex)
                {
                    throw new Exception();
                }
            }
            while (dateStep < dateEnd);

            employeeData.incomeByRangeWeek = incomeByRangeItems;

            List<IncomeByRangeItemEmployee> incomeByRangeItemsMonth = new List<IncomeByRangeItemEmployee>();
            DateTime date = DateTime.Today;
            var dateStartMonth = new DateTime(date.Year, date.Month, 1);
            var dateEndMonth = dateStartMonth.AddMonths(1);
            var dateStepMonth = dateStartMonth;
            var workshiftsMonth = await _context.EmployeeOnWorkshift.Where(x => x.WorkshiftNavigation.Date >= dateStartMonth && x.WorkshiftNavigation.Date < dateEndMonth && x.WorkshiftNavigation.Timeend != null && x.Workshift != null && x.Employee == employeeGuid).Include(x => x.WorkshiftNavigation).ToListAsync();
            do
            {
                try
                {
                    IncomeByRangeItemEmployee incomeByRangeItem = new IncomeByRangeItemEmployee();

                    var workshiftList = workshiftsMonth.Where(x => x.WorkshiftNavigation.Date.Value.Date == dateStepMonth.Date).ToList();

                    incomeByRangeItem.date = dateStepMonth;

                    foreach (var workshift in workshiftList)
                    {
                        incomeByRangeItem.tokens = (double)(incomeByRangeItem.tokens + workshift.Token);
                    }
                    incomeByRangeItemsMonth.Add(incomeByRangeItem);
                    dateStepMonth = dateStepMonth.AddDays(1);
                }
                catch (Exception ex)
                {
                    throw new Exception();
                }
            }
            while (dateStepMonth < dateEndMonth);

            employeeData.incomeByRangeMonth = incomeByRangeItemsMonth;

            return employeeData;
        }

        [HttpGet("productionWorkshift")]
        public async Task<ActionResult<ICollection<EmployeeProduction>>> ProductionWorkshift(string workplace, int week)
        {
            var range = new ConclusionRange();

            var workplaceGuid = new Guid(workplace);

            var employees = await _context.Employee.Where(x=>x.HouseNavigation.Workplace == workplaceGuid && x.UserNavigation.Role == "model" && x.Actuality == true).ToListAsync();

            List<EmployeeProduction> listModelData = new List<EmployeeProduction>();

            foreach (Employee employee in employees)
            {
                listModelData.Add((await GetModelData(employee.Id.ToString(), week)).Value);
            }

            return listModelData;
        }

        [HttpGet("productionWorkshiftLight")]
        public async Task<ActionResult<ICollection<EmployeeProductionLight>>> ProductionWorkshiftLight(string house, int week)
        {
            var range = new ConclusionRange();

            var houseGuid = new Guid(house);

            var monday = range.monday.AddDays((7 * week));
            var sunday = range.sunday.AddDays((7 * week));

            var employees = await _context.Employee.Where(x => x.House == houseGuid && x.UserNavigation.Role == "model" && x.Actuality == true).ToListAsync();

            List<EmployeeProductionLight> listModelData = new List<EmployeeProductionLight>();

            foreach (Employee employee in employees)
            {
                listModelData.Add((await GetModelDataLight(employee.Id.ToString(), week)).Value);
            }

            return listModelData;
        }

        private async Task<ActionResult<EmployeeProductionLight>> GetModelDataLight(string employee, int week)
        {
            EmployeeProductionLight modelData = new EmployeeProductionLight();

            var employeeGuid = new Guid(employee);
            var range = new ConclusionRange();

            var monday = range.monday.AddDays((7 * week));
            var sunday = range.sunday.AddDays((7 * week));

            DateTime date = DateTime.Today;

            date = date.AddDays((7 * week));

            var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            modelData.workshiftsCount = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= monday && x.WorkshiftNavigation.Date < sunday.AddDays(1) && x.WorkshiftNavigation.Actuality.Value).CountAsync();
            modelData.workshiftsCountMonth = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= firstDayOfMonth && x.WorkshiftNavigation.Date < lastDayOfMonth && x.WorkshiftNavigation.Timeend != null && x.WorkshiftNavigation.Actuality.Value).CountAsync();

            var halfWorkshiftsWeeklyCount = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= monday && x.WorkshiftNavigation.Date < sunday.AddDays(1) && x.WorkshiftNavigation.Actuality.Value && x.WorkshiftNavigation.Isfull == false).CountAsync();
            var halfWorkshiftsMonthCount = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= firstDayOfMonth && x.WorkshiftNavigation.Date < lastDayOfMonth && x.WorkshiftNavigation.Timeend != null && x.WorkshiftNavigation.Actuality.Value && x.WorkshiftNavigation.Isfull == false).CountAsync();

            modelData.workshiftsCount -= (halfWorkshiftsWeeklyCount / 2);
            modelData.workshiftsCountMonth -= (halfWorkshiftsMonthCount / 2);

            var employeeObj = await _context.Employee.Where(x => x.Id == employeeGuid).FirstAsync();
            modelData.employee = employeeObj;

            modelData.workshiftNormally = employeeObj.Studying ? 4 : 6;

            return modelData;
        }

        private async Task<ActionResult<EmployeeProduction>> GetModelData(string employee, int week = 0)
        {
            EmployeeProduction modelData = new EmployeeProduction();

            var employeeGuid = new Guid(employee);
            var range = new ConclusionRange();

            var monday = range.monday.AddDays((7 * week));
            var sunday = range.sunday.AddDays((7 * week));

            DateTime date = DateTime.Today;

            date = date.AddDays((7 * week));

            var workshiftsEmployeeWeekly = await _context.Workshift.Where(x => x.Date >= monday && x.Date < sunday.AddDays(1) && x.Timeend != null && x.Actuality.Value).OrderBy(x => x.Date).Select(x => x.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid)).ToListAsync();

            foreach (ICollection<EmployeeOnWorkshift> workshiftEmployeeCollection in workshiftsEmployeeWeekly)
            {
                foreach (EmployeeOnWorkshift employeeOnWorkshift in workshiftEmployeeCollection)
                {
                    modelData.tokenWeekly = (double)(modelData.tokenWeekly + employeeOnWorkshift.Token);
                }
            }


            var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var workshiftsEmployeeMonth = await _context.Workshift.Where(x => x.Date >= firstDayOfMonth && x.Date < lastDayOfMonth && x.Timeend != null && x.Actuality.Value).OrderBy(x => x.Date).Select(x => x.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid)).ToListAsync();

            foreach (ICollection<EmployeeOnWorkshift> workshiftEmployeeCollection in workshiftsEmployeeMonth)
            {
                foreach (EmployeeOnWorkshift employeeOnWorkshift in workshiftEmployeeCollection)
                {
                    modelData.tokenMonth = (double)(modelData.tokenMonth + employeeOnWorkshift.Token);
                }
            }

            modelData.workshiftsCount = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= range.monday && x.WorkshiftNavigation.Date < range.sunday.AddDays(1) && x.WorkshiftNavigation.Actuality.Value).CountAsync();
            modelData.workshiftsCountMonth = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= firstDayOfMonth && x.WorkshiftNavigation.Date < lastDayOfMonth && x.WorkshiftNavigation.Timeend != null && x.WorkshiftNavigation.Actuality.Value).CountAsync();

            double halfWorkshiftsWeeklyCount = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= range.monday && x.WorkshiftNavigation.Date < range.sunday.AddDays(1) && x.WorkshiftNavigation.Actuality.Value && x.WorkshiftNavigation.Isfull == false).CountAsync();
            double halfWorkshiftsMonthCount = await _context.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid && x.WorkshiftNavigation.Date >= firstDayOfMonth && x.WorkshiftNavigation.Date < lastDayOfMonth && x.WorkshiftNavigation.Timeend != null && x.WorkshiftNavigation.Actuality.Value && x.WorkshiftNavigation.Isfull == false).CountAsync();

            modelData.workshiftsCount -= (halfWorkshiftsWeeklyCount / 2);
            modelData.workshiftsCountMonth -= (halfWorkshiftsMonthCount / 2);

            List<double?> doubles = await _context.Loan.Where(x => x.Employee == employeeGuid).Select(x => x.Amount).ToListAsync();
            modelData.loan = doubles.Sum();
            var loanCount = await _context.Loan.Where(x => x.Employee == employeeGuid).CountAsync();
            modelData.isLoan = loanCount > 0;

            var employeeObj = await _context.Employee.Where(x=>x.Id == employeeGuid).FirstAsync();
            modelData.employee = employeeObj;

            modelData.house = await _context.House.FindAsync(employeeObj.House);

            modelData.penaltyOnShifts = await _context.PenaltyOnShift.Where(x => x.WorkshiftNavigation.Date >= range.monday && x.WorkshiftNavigation.Date < range.sunday.AddDays(1) && x.WorkshiftNavigation.Timeend != null && x.Employee == employeeGuid).ToListAsync();
            modelData.workshiftNormally = employeeObj.Studying ? 4 : 6;

            modelData.averageOutputCoefficient = modelData.workshiftsCountMonth != 0 ? Math.Round(modelData.tokenMonth / modelData.workshiftsCountMonth, 2) : 0;

            modelData.procent = employeeObj.Procent.Value;

            return modelData;
        }
        private async Task<ActionResult<EmployeeProduction>> GetModelDataTokens(string employee)
        {
            EmployeeProduction modelData = new EmployeeProduction();

            var employeeGuid = new Guid(employee);
            var range = new ConclusionRange();
            var workshiftsEmployeeWeekly = await _context.Workshift.Where(x => x.Date >= range.monday && x.Date < range.sunday.AddDays(1) && x.Timeend != null && x.Actuality.Value).OrderBy(x => x.Date).Select(x => x.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid)).ToListAsync();

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

            var workshiftsEmployeeMonth = await _context.Workshift.Where(x => x.Date >= firstDayOfMonth && x.Date < lastDayOfMonth && x.Timeend != null && x.Actuality.Value).OrderBy(x => x.Date).Select(x => x.EmployeeOnWorkshift.Where(x => x.Employee == employeeGuid)).ToListAsync();

            foreach (ICollection<EmployeeOnWorkshift> workshiftEmployeeCollection in workshiftsEmployeeMonth)
            {
                foreach (EmployeeOnWorkshift employeeOnWorkshift in workshiftEmployeeCollection)
                {
                    modelData.tokenMonth = (double)(modelData.tokenMonth + employeeOnWorkshift.Token);
                }
            }

            var employeeObj = await _context.Employee.Where(x=>x.Id == employeeGuid).FirstAsync();
            modelData.employee = employeeObj;
            modelData.house = await _context.House.FindAsync(employeeObj.House);

            return modelData;
        }
    }

    public class EmployeeProduction
    {
        public double tokenWeekly = 0;
        public double tokenMonth = 0;
        public double averageOutputCoefficient = 0;
        public double rub;
        public double workshiftsCount;
        public double workshiftsCountMonth;
        public double? loan;
        public List<PenaltyOnShift> penaltyOnShifts;
        public int workshiftNormally = 6;
        public bool isLoan = false;
        public Employee employee;
        public House house;
        public int procent;
    }

    public class EmployeeProductionLight
    {
        public double workshiftsCount;
        public double workshiftsCountMonth;
        public double workshiftNormally = 6;
        public Employee employee;
    }

    public class IncomeByRangeItem 
    {
        public List<Workshift> Workshifts;
        public double tokens = 0;
        public DateTime date;
    }

    public class IncomeByRangeItemEmployee
    {
        public double tokens = 0;
        public DateTime date;
    }

    public class IncomeByRangeHouse
    {
        public List<IncomeByRangeItem> incomeByRangeItem;
        public House house;
    }

    public class IncomeByRangeYear
    {
        public List<IncomeByRangeItem> incomeByRangeItems;
        public DateTime date;
        public double tokens;
    }

    public class EmployeeData
    {
        public Employee employee;
        public House house;
        public List<IncomeByRangeItemEmployee> incomeByRangeWeek;
        public List<IncomeByRangeItemEmployee> incomeByRangeMonth;
        public EmployeeProduction modelData;
    }
}
