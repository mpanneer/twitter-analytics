package au.edu.unimelb.comp90024;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * The Util class provides various utilitarian functions that can be used by the
 * library
 * 
 *
 * @author msatyam
 * @version 1.0
 * @since 2018-05-01
 */
public class Util {
    final static Charset ENCODING = StandardCharsets.UTF_8;

    public static String readFile(String fileName) throws IOException {
        return readFile(fileName, ENCODING);

    }

    public static String readFile(String fileName, Charset encoding)
            throws IOException {
        StringBuilder sb = new StringBuilder();
        Path path = Paths.get(fileName);
        try (BufferedReader reader = Files.newBufferedReader(path, encoding)) {
            String line = null;
            while ((line = reader.readLine()) != null) {
                // process each line in some way
                sb.append(line);
            }
        }
        return sb.toString();
    }

    public static String writeFile(String fileName, Charset encoding)
            throws IOException {
        StringBuilder sb = new StringBuilder();
        Path path = Paths.get(fileName);
        try (BufferedReader reader = Files.newBufferedReader(path, encoding)) {
            String line = null;
            while ((line = reader.readLine()) != null) {
                // process each line in some way
                sb.append(line);
            }
        }
        return sb.toString();
    }

    public static int getFileLineCount(String fileName) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(fileName));
        int lines = 0;
        while (reader.readLine() != null)
            lines++;
        reader.close();
        return lines;
    }

    public static <T> void printList(String msg, List<T> list) {
        System.out.println(msg);
        System.out.println(
                "----------------------------------------------------");
        for (T item : list) {
            System.out.println(item);
        }
        System.out.println(" ");
    }

    public static <T> String doGetHttp(String endpointURL) throws IOException {
        StringBuilder response = new StringBuilder();
        URL url2 = new URL(endpointURL);
        HttpURLConnection conn2 = (HttpURLConnection) url2.openConnection();
        conn2 = (HttpURLConnection) url2.openConnection();
        conn2.setRequestMethod("GET");
        BufferedReader rds = new BufferedReader(
                new InputStreamReader(conn2.getInputStream()));
        String line;
        while ((line = rds.readLine()) != null) {
            response.append(line);
        }
        return response.toString();
    }
}
