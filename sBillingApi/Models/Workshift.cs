using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Workshift
    {
        public Workshift()
        {
            EmployeeOnWorkshift = new HashSet<EmployeeOnWorkshift>();
            PenaltyOnShift = new HashSet<PenaltyOnShift>();
            Petition = new HashSet<Petition>();
            RoomOnWorkshift = new HashSet<RoomOnWorkshift>();
        }

        public Guid Id { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? Timestart { get; set; }
        public DateTime? Timeend { get; set; }
        public double? Token { get; set; }
        public Guid? House { get; set; }
        public Guid? Responsible { get; set; }
        public bool? Isfull { get; set; }
        public Guid? Wtype { get; set; }
        public bool? Actuality { get; set; }

        public virtual House HouseNavigation { get; set; }
        public virtual WorkshiftType WtypeNavigation { get; set; }
        public virtual ICollection<EmployeeOnWorkshift> EmployeeOnWorkshift { get; set; }
        public virtual ICollection<PenaltyOnShift> PenaltyOnShift { get; set; }
        public virtual ICollection<Petition> Petition { get; set; }
        public virtual ICollection<RoomOnWorkshift> RoomOnWorkshift { get; set; }
    }
}
