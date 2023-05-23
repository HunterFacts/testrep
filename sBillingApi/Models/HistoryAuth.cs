using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class HistoryAuth
    {
        public Guid Id { get; set; }
        public Guid? Employee { get; set; }
        public string Login { get; set; }
        public DateTime? Date { get; set; }
        public string Status { get; set; }
        public string IpAddress { get; set; }
        public string Device { get; set; }
        public string Country { get; set; }
        public string Digitaltrace { get; set; }
        public string Reason { get; set; }

        public virtual Employee EmployeeNavigation { get; set; }
    }
}
