package au.edu.unimelb.comp90024;

/**
 * The GeoTag class represents a json object added to each tweet. This is
 * created by reverse geocoding the lat/long coordinates in a tweet
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class GeoTag {

    private String staddress; // eg ":"Stop 59: Dandenong Road",
    private String suburb; // eg:"BRIGHTON",
    private String prov; // eg:"AU",
    private String country; // eg:"Australia",

    public GeoTag(String staddress, String suburb, String prov,
            String country) {
        super();
        if (staddress != null)
            this.staddress = staddress.toLowerCase();
        if (suburb != null)
            this.suburb = suburb.toLowerCase().replace(" ", "");
        if (prov != null)
            this.prov = prov.toLowerCase();
        if (country != null)
            this.country = country.toLowerCase();
    }

    public String getStaddress() {
        return staddress;
    }

    public void setStaddress(String staddress) {
        this.staddress = staddress;
    }

    public String getSuburb() {
        return suburb;
    }

    public void setSuburb(String suburb) {
        this.suburb = suburb;
    }

    public String getProv() {
        return prov;
    }

    public void setProv(String prov) {
        this.prov = prov;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
