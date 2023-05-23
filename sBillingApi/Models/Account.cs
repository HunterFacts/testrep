using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Account
    {
        public Account()
        {
            EmployeeOnWorkshift = new HashSet<EmployeeOnWorkshift>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? Employee { get; set; }
        public bool? Actuality { get; set; }

        public virtual Employee EmployeeNavigation { get; set; }
        public virtual ICollection<EmployeeOnWorkshift> EmployeeOnWorkshift { get; set; }
    }
}
