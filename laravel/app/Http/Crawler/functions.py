def hoursToMins(time):
    time = time.replace('\u202f', ' ')
    split = time.split(' h')
    for v in split:
        if v.isdigit():
            htm = int(v) * 60
        else:
            try:
                htm
            except:
                v = v.replace(' min', ' ').strip()
                minutes = int(v)
            else:
                v = v.replace(' min', ' ').strip()
                if v is not "":
                   minutes = int(v) + htm
                else:
                    minutes = htm
    return minutes