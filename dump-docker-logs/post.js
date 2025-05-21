const { execSync } = require('child_process');

/**
 * Dump logs for all running Docker containers
 * This script can be used in CI to get debugging information when tests fail
 */
function dumpDockerLogs() {
  try {
    console.log('==== DUMPING DOCKER LOGS ====');

    // Get all running container IDs
    const containerIds = execSync('docker ps -q').toString().trim().split('\n').filter(Boolean);

    if (containerIds.length === 0) {
      console.log('No running Docker containers found.');
      return;
    }

    // Log information about each container
    containerIds.forEach((containerId) => {
      try {
        // Get container info (name, image, etc.)
        const containerInfo = execSync(
          `docker inspect --format '{{.Name}} ({{.Config.Image}})' ${containerId}`,
        )
          .toString()
          .trim();
        console.log(`\n\n==== CONTAINER: ${containerInfo} ====`);

        // Get container logs
        const logs = execSync(`docker logs ${containerId} 2>&1`).toString();
        console.log(logs);

        console.log(`==== END LOGS FOR ${containerInfo} ====\n`);
      } catch (containerError) {
        console.error(`Error getting logs for container ${containerId}:`, containerError.message);
      }
    });

    console.log('==== FINISHED DUMPING DOCKER LOGS ====');
  } catch (error) {
    console.error('Error dumping Docker logs:', error.message);
  }
}

// Execute the function when the script is run
dumpDockerLogs();
