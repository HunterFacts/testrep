using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class House
    {
        public House()
        {
            Employee = new HashSet<Employee>();
            Room = new HashSet<Room>();
            Workshift = new HashSet<Workshift>();
            WorkshiftType = new HashSet<WorkshiftType>();
        }

        public Guid Id { get; set; }
        public string AddressString { get; set; }
        public string HouseNumber { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string Name { get; set; }
        public Guid? Workplace { get; set; }
        public bool? Actuality { get; set; }

        public virtual Workplace WorkplaceNavigation { get; set; }
        public virtual ICollection<Employee> Employee { get; set; }
        public virtual ICollection<Room> Room { get; set; }
        public virtual ICollection<Workshift> Workshift { get; set; }
        public virtual ICollection<WorkshiftType> WorkshiftType { get; set; }
    }
}
