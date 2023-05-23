using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class WorkshiftType
    {
        public WorkshiftType()
        {
            Workshift = new HashSet<Workshift>();
        }

        public Guid Id { get; set; }
        public TimeSpan? Timestart { get; set; }
        public TimeSpan? Timeend { get; set; }
        public string Timename { get; set; }
        public Guid? House { get; set; }
        public int Position { get; set; }
        public bool? Shiftchange { get; set; }

        public virtual House HouseNavigation { get; set; }
        public virtual ICollection<Workshift> Workshift { get; set; }
    }
}
