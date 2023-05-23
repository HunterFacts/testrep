using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Conclusion
    {
        public Guid Id { get; set; }
        public DateTime? Date { get; set; }
        public bool? Actuality { get; set; }
    }
}
