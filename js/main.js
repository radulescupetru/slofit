function percentage_by_features(sex,height_lower,height_upper,age_lower,age_upper,year_lower,year_upper){
    sql=String("")
    if(sex==1){
        sql = "SELECT sex,age_yrs,BMI from patients_new where age_yrs between ${age_lower} and ${age_upper} and height between ${height_lower} and ${height_upper} and year between ${year_lower} and ${year_upper} and sex=1"
    }
}
