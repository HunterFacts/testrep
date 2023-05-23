using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class AnswerPetition
    {
        public Guid Id { get; set; }
        public string Message { get; set; }
        public DateTime? Date { get; set; }
        public Guid? Petition { get; set; }
        public Guid? Employee { get; set; }

        public virtual Employee EmployeeNavigation { get; set; }
        public virtual Petition PetitionNavigation { get; set; }
    }
}
