package au.edu.unimelb.comp90024;

import java.util.logging.Logger;

/**
 * The Suburb class represents information of one suburb obtained from AURIN
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class Suburb {
    private final static Logger LOGGER = Logger
            .getLogger(Suburb.class.getName());

    long uniStudentPercent; // 0.479857,
    long percentEmployed; // "emp_to_pop":0.725321,
    long medianIncome; // "median11":55477.0404,
    String SSCName; // "SSC_NAME":"Abbotsford (Vic.)",
    long yearTwelvePassPercent; // "y12":0.343181,
    long suburbCode; // "SSC2011":20001
    String suburbName;

    public String getSuburbName() {
        return suburbName;
    }

    public void setSuburbName(String suburbName) {
        this.suburbName = suburbName;
    }

    String type;

    public Suburb(long uniStudentPercent, long percentEmployed,
            long medianIncome, String sSCName, long yearTwelvePassPercent,
            long suburbCode, String type, String suburbName) {
        super();
        this.uniStudentPercent = uniStudentPercent;
        this.percentEmployed = percentEmployed;
        this.medianIncome = medianIncome;
        SSCName = sSCName;
        this.yearTwelvePassPercent = yearTwelvePassPercent;
        this.suburbCode = suburbCode;
        this.type = type;
        this.suburbName = suburbName;
    }

    public long getUniStudentPercent() {
        return uniStudentPercent;
    }

    public void setUniStudentPercent(long uniStudentPercent) {
        this.uniStudentPercent = uniStudentPercent;
    }

    public long getPercentEmployed() {
        return percentEmployed;
    }

    public void setPercentEmployed(long percentEmployed) {
        this.percentEmployed = percentEmployed;
    }

    public long getMedianIncome() {
        return medianIncome;
    }

    public void setMedianIncome(long medianIncome) {
        this.medianIncome = medianIncome;
    }

    public String getSSCName() {
        return SSCName;
    }

    public void setSSCName(String sSCName) {
        SSCName = sSCName;
    }

    public long getYearTwelvePassPercent() {
        return yearTwelvePassPercent;
    }

    public void setYearTwelvePassPercent(long yearTwelvePassPercent) {
        this.yearTwelvePassPercent = yearTwelvePassPercent;
    }

    public long getSuburbCode() {
        return suburbCode;
    }

    public void setSuburbCode(long suburbCode) {
        this.suburbCode = suburbCode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

}
