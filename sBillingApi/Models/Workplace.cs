using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Workplace
    {
        public Workplace()
        {
            Employee = new HashSet<Employee>();
            House = new HashSet<House>();
            InverseMainWorkplaceNavigation = new HashSet<Workplace>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? MainWorkplace { get; set; }
        public bool? Actuality { get; set; }

        public virtual Workplace MainWorkplaceNavigation { get; set; }
        public virtual ICollection<Employee> Employee { get; set; }
        public virtual ICollection<House> House { get; set; }
        public virtual ICollection<Workplace> InverseMainWorkplaceNavigation { get; set; }
    }
}
