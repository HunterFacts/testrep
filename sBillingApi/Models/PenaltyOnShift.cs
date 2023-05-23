using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class PenaltyOnShift
    {
        public Guid Id { get; set; }
        public string Reason { get; set; }
        public double? Amount { get; set; }
        public Guid? Employee { get; set; }
        public Guid? Workshift { get; set; }
        public bool? Actuality { get; set; }

        public virtual Employee EmployeeNavigation { get; set; }
        public virtual Workshift WorkshiftNavigation { get; set; }
    }
}
