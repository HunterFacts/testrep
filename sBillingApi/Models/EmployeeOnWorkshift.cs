using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class EmployeeOnWorkshift
    {
        public Guid Id { get; set; }
        public double? Token { get; set; }
        public int? Room { get; set; }
        public Guid? Workshift { get; set; }
        public Guid? Employee { get; set; }
        public Guid? Account { get; set; }
        public bool? Actuality { get; set; }
        public Guid? RoomOnWorkshift { get; set; }

        public virtual Account AccountNavigation { get; set; }
        public virtual Employee EmployeeNavigation { get; set; }
        public virtual RoomOnWorkshift RoomOnWorkshiftNavigation { get; set; }
        public virtual Workshift WorkshiftNavigation { get; set; }
    }
}
