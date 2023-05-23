using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class RoomOnWorkshift
    {
        public RoomOnWorkshift()
        {
            EmployeeOnWorkshift = new HashSet<EmployeeOnWorkshift>();
        }

        public Guid Id { get; set; }
        public double? Token { get; set; }
        public Guid? Workshift { get; set; }
        public Guid? Room { get; set; }

        public virtual Room RoomNavigation { get; set; }
        public virtual Workshift WorkshiftNavigation { get; set; }
        public virtual ICollection<EmployeeOnWorkshift> EmployeeOnWorkshift { get; set; }
    }
}
