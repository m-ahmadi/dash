## Argus Version 2.8

## Git tag
* stable.2.8

### Note:
* edit timeZones.json file required to rebind file to changes submit on binary data

### for api doc update
apidoc -i ./ -o ./doc/api

### deployment

## Run binary:
Argus config file  path read "/opt/argus/argus.ini"
with out this config file you could not run application
## configure moudle
```
    LogFilePath          string
	SqlDB                string `valid:"required"`
	SqlHost              string `valid:"required"`
	SqlPort              int
	SqlUser              string `valid:"required"`
	SqlPass              string `valid:"required"`
	SqlDriver            string
	SecretKey            string
	SessionName          string
	Debug                bool
	CassandraHost        string `valid:"required"`
	CassandraKeySpace    string `valid:"required"`
	DateTimeFormat       string
	DateTimeFormatHolder string
	CassandraOdlSchema   bool
	ArgusFront           string
	ListenerPort         string
	LiveChartOnly        bool
	Temp                 string
	ExtraDetail          bool
	CoreLog              string
```
    required tags must be enter in argus.ini file

## uprade and fix DB issues with
* ./ArgusGo db

## As Service

copy binary to a path with systemd or init.d scripts that available in attachment
you could set binary as service just fix "WORKINGDIR" variable with binary path in
init.d script and copy script to /etc/init.d/ or fix "WorkingDirectory" variable in
systemd script.


## front
You can set path front directory with ArgusFront or paste front directory in
ArgusGo path.
