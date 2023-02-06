The simplest is to parse the output of commands using popen.

The following:

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void parse_output(char *buf, size_t bufsize, const char cmd[]) 
{
    assert(buf != NULL);
    assert(cmd != NULL);

    FILE *fp;

    // add dynamic allocation here
    memset(buf, 0, bufsize);

    if ((fp = popen(cmd, "r")) == NULL) {
        printf("Error opening pipe!\n");
        exit(-__LINE__);
    }

    // worst speed ever. And strlen is called twice...
    while (fgets(&buf[strlen(buf)], bufsize - strlen(buf), fp) != NULL);

    if(pclose(fp))  {
        printf("Command not found or exited with error status\n");
        exit(-__LINE__);
    }
}


int main() {
    char buf[256];
    long num;

    parse_output(buf, sizeof(buf), "ps -A --no-headers | wc -l");
    if (sscanf(buf, "%ld", &num) != 1) {
        exit(-__LINE__);
    }
    printf("Number of processes: %ld\n", num);

    parse_output(buf, sizeof(buf), "ps -AL --no-headers | wc -l");
    if (sscanf(buf, "%ld", &num) != 1) {
        exit(-__LINE__);
    }
    printf("Number of processes including tasks: %ld\n", num);

}