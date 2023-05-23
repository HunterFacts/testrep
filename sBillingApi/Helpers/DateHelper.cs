using System;

namespace sBillingApi.Helpers
{
    static public class DateHelper
    {
        public static DateTime Previous(this DateTime start, DayOfWeek day)
        {
            do
                start = start.AddDays(-1);
            while (start.DayOfWeek != day);

            return start;
        }

        public static DateTime Next(this DateTime start, DayOfWeek day)
        {
            do
                start = start.AddDays(+1);
            while (start.DayOfWeek != day);

            return start;
        }
    }

    public class ConclusionRange {

        public ConclusionRange()
        {
            var dayOfWeek = DateTime.Today.DayOfWeek;
            switch (dayOfWeek)
            {
                case DayOfWeek.Monday:
                    monday = DateTime.Today;
                    sunday = DateTime.Today.AddDays(6);

                    break;
                case DayOfWeek.Sunday:
                    monday = DateTime.Today.AddDays(-6);
                    sunday = DateTime.Today;
                    break;

                default:
                    monday = DateTime.Today.Previous(DayOfWeek.Monday);
                    sunday = DateTime.Today.Next(DayOfWeek.Sunday);
                    break;
            }
        }

        public ConclusionRange(DateTime date)
        {
            var dayOfWeek = date.DayOfWeek;
            switch (dayOfWeek)
            {
                case DayOfWeek.Monday:
                    monday = DateTime.Today;
                    sunday = DateTime.Today.AddDays(6);

                    break;
                case DayOfWeek.Sunday:
                    monday = DateTime.Today.AddDays(-6);
                    sunday = DateTime.Today;
                    break;

                default:
                    monday = DateTime.Today.Previous(DayOfWeek.Monday);
                    sunday = DateTime.Today.Next(DayOfWeek.Sunday);
                    break;
            }
        }

        public DateTime monday;
        public DateTime sunday;
    }
}
