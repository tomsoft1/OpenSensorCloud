

#include <Bridge.h>
// #include <SPI.h>
#include "EmonLib.h" // Include Emon Library
// #include <LiquidCrystal.h>
// #include <SD.h>
// #define ETHERNET_LOGIN
// #include <Ethernet.h>
#define APIKEY "<your api key>>"
#define DEVICE_ID "<your device id>"
#define USERAGENT "Arduino" // user agent is the project name

String one_reading();
void sendData(String &thisData);

// assign a MAC address for the ethernet controller.
// fill in your address here:
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};

const char server[] = "api.opensensorcloud.com"; // name address for opensensorcloud

unsigned long lastConnectionTime = 0;            // last time you connected to the server, in milliseconds
boolean lastConnected = false;                   // state of the connection last time through the main loop
const unsigned long postingInterval = 10 * 1000; // delay between updates to xively.com

#define NB_SENSORS 3
EnergyMonitor emon[NB_SENSORS]; // Create an instance
double watts[NB_SENSORS];
double sum[NB_SENSORS];
double total;
int nb_samples;
int max = 0;
int min = 30000;
double total_watts = 0.0;
double time_total = 0.0;

#define JNPin 13
#define chipSelect 4
#define VOLT_FACTOR 220.0
void setup()
{
  // Open serial communications and wait for port to open:
  Serial.begin(9600);

  Bridge.begin();

  for (int i = 0; i < NB_SENSORS; i++)
  {
    //    EnergyMonitor *tmpEmon=new EnergyMonitor();
    //    emon[i]=tmpEmon;
    emon[i].current(1 + i, 60.6); // Current: input pin, calibration.
    sum[i] = 0.0;
  }
  one_reading();
  for (int i = 0; i < NB_SENSORS; i++)
  {
    sum[i] = 0;
    watts[i] = 0;
  }
  total = 0;
  nb_samples = 0;
  // give the ethernet module time to boot up:
  delay(1000);
}

String res;
void loop()
{
  //  float val = analogRead(A1);
  one_reading(); // Use res
  int current_watt = int((VOLT_FACTOR)*total / nb_samples);
  if (current_watt > max)
  {
    max = current_watt;
  };
  if (current_watt < min)
  {
    min = current_watt;
  };

  Serial.println(" ");

  // if there's incoming data from the net connection.
  // send it out the serial port.  This is for debugging
  // purposes only:

  // if you're not connected, and ten seconds have passed since
  // your last connection, then connect again and send data:
  Serial.println("Time:" + String(millis() - lastConnectionTime));
  if ((millis() - lastConnectionTime > postingInterval))
  {
    Serial.println("Will post...");
    String data = "[";
    for (int i = 0; i < NB_SENSORS; i++)
    {
      data = data + "{\"name\":\"watt_" + String(i) + "\",\"value\":" + String((sum[i] / nb_samples) * VOLT_FACTOR) + "},";
      sum[i] = 0;
    }
    double watts = (total / nb_samples) * VOLT_FACTOR;
    data += "{\"name\":\"watt\",\"value\":" + String(watts) + "}";
    data += "]";

    // Compute kilowatt/h
    long delta = (millis() - lastConnectionTime) / 1000; // sec
    time_total += delta;
    total_watts += watts / 1000.0; // Conso total en kW/h
    Serial.println("total:" + String(watts) + " millis:" + String(delta) + " kW sincestart:" + String(total_watts, 5) + " Time total:" + String(time_total) + " kW/h:" + String(total_watts * time_total / 3600, 5));
    Serial.println("Sending:" + data);
    total = 0.0;
    nb_samples = 0;

    sendData(data);

    // note the time that the connection was made or attempted:
    lastConnectionTime = millis();
  }
}

void sendData(String &thisData)
{
  Process p;

  String cmd = "curl -X POST --header \"X-ApiKey:" + String(APIKEY) + "\"";
  cmd = cmd + " -d '" + String(thisData) + "' ";
  cmd = cmd + server + String(DEVICE_ID);
  Serial.println("Sending:" + cmd);
  p.runShellCommand(cmd);
  Console.println(cmd);

  while (p.running())
    ;

  while (p.available() > 0)
  {
    char c = p.read();
    Serial.print(c);
  }
  Serial.flush();
  p.close();
}

String one_reading()
{
  res = "";
  for (int i = 0; i < NB_SENSORS; i++)
  {
    //      lcd_key = read_LCD_buttons();  // read the buttons

    double Irms = emon[i].calcIrms(2000); // Calculate Irms only
    double watt = Irms * VOLT_FACTOR;
    // Serial.print("Read:"+String(val)+" ");
    Serial.print(watt); // Apparent power
    Serial.print(" ");
    Serial.print(Irms); // Irms
    Serial.print("| ");
    watts[i] = watt;
    sum[i] += Irms;
    total += Irms;
    //  emon1.serialprint();
    res += (String(int(watt)) + " ");
  }
  nb_samples++;
  return res;
}
